import 'dotenv/config'
import express from 'express'
import Stripe from 'stripe'
import nodemailer from 'nodemailer'
import { v4 as uuidv4 } from 'uuid'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import { existsSync, readFileSync, writeFileSync } from 'fs'
import Anthropic from '@anthropic-ai/sdk'

const __dirname = dirname(fileURLToPath(import.meta.url))
const app = express()
app.use(express.json())

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
  timeout: 120000,
  maxRetries: 3
})

// Simple file-based store for claims (swap for a real DB later)
const CLAIMS_FILE = join(__dirname, 'claims.json')
function loadClaims() {
  try { return JSON.parse(readFileSync(CLAIMS_FILE, 'utf8')) } catch { return {} }
}
function saveClaims(claims) {
  writeFileSync(CLAIMS_FILE, JSON.stringify(claims, null, 2))
}

// Email transporter - uses Gmail or any SMTP
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_FROM,
    pass: process.env.EMAIL_PASSWORD
  }
})

// Generate letters using Claude
async function generateLetters(data) {
  const { yourName, yourJob, clientName, clientEmail, amount, daysOverdue, workDesc } = data
  const today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })

  const prompt = `You are a professional debt collection letter writer. Generate exactly 3 demand letters for a freelancer trying to collect an unpaid invoice.

Context:
- Freelancer: ${yourName} (${yourJob})
- Client: ${clientName} (${clientEmail})
- Amount owed: $${amount}
- Days overdue: ${daysOverdue}
- Work performed: ${workDesc}
- Today's date: ${today}

Return ONLY a JSON object with this exact structure, no markdown:
{
  "letter1": {
    "subject": "email subject line",
    "body": "full letter text"
  },
  "letter2": {
    "subject": "email subject line",
    "body": "full letter text"
  },
  "letter3": {
    "subject": "email subject line",
    "body": "full letter text"
  }
}

Letter 1 (Day 1): Firm but professional reminder. Reference the specific work, amount, and days overdue. Request payment within 7 days. Tone: serious but not threatening.

Letter 2 (Day 8): Legal notice tone. Reference applicable contract law and intent to pursue legal remedies including small claims court. Name specific consequences. Tone: authoritative and urgent.

Letter 3 (Day 15): Final demand before filing. State that small claims court paperwork has been prepared and will be filed within 72 hours. Include that filing fees and interest will be added to the judgment. Tone: final warning, no room for negotiation.

Make each letter highly specific to the work described. Use formal language. Sign each letter with the freelancer's full name.`

  const message = await anthropic.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 2000,
    messages: [{ role: 'user', content: prompt }]
  })

  const raw = message.content[0].text.trim()
  try {
    return JSON.parse(raw)
  } catch {
    const match = raw.match(/\{[\s\S]*\}/)
    return JSON.parse(match[0])
  }
}

// Send an email
async function sendEmail({ to, cc, subject, body, from }) {
  await transporter.sendMail({
    from: `"Stiffed Claims" <${process.env.EMAIL_FROM}>`,
    to,
    cc,
    subject,
    text: body,
    html: `<pre style="font-family:Georgia,serif;font-size:15px;line-height:1.8;max-width:600px;white-space:pre-wrap">${body}</pre>`
  })
}

// TEST endpoint — bypasses payment, sends letters directly
app.post('/api/test-claim', async (req, res) => {
  const { yourName, yourEmail, yourJob, clientName, clientEmail, amount, daysOverdue, workDesc, testKey } = req.body

  if (testKey !== process.env.TEST_KEY) {
    return res.status(403).json({ error: 'Invalid test key.' })
  }

  const claimId = uuidv4()
  const claims = loadClaims()
  claims[claimId] = {
    id: claimId, status: 'active',
    yourName, yourEmail, yourJob,
    clientName, clientEmail,
    amount, daysOverdue, workDesc,
    createdAt: new Date().toISOString(),
    letters: [], sentAt: [], paidAt: new Date().toISOString(),
    sendLetter2At: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000).toISOString(),
    sendLetter3At: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString()
  }

  // Return immediately, process in background
  res.json({ claimId, success: true, message: 'Claim filed. Letters generating — check your email in ~30 seconds.' })

  // Process async
  ;(async () => {
    try {
      const letters = await generateLetters(claims[claimId])
      claims[claimId].letters = letters
      await sendEmail({ to: clientEmail, cc: yourEmail, subject: letters.letter1.subject, body: letters.letter1.body })
      claims[claimId].sentAt[0] = new Date().toISOString()
      saveClaims(claims)
      console.log(`Test claim ${claimId} — letter sent to ${clientEmail}`)
    } catch (err) {
      console.error('Test claim error:', err.message)
    }
  })()
})

// Create Stripe checkout session
app.post('/api/create-checkout', async (req, res) => {
  const { yourName, yourEmail, yourJob, clientName, clientEmail, amount, daysOverdue, workDesc } = req.body

  if (!yourName || !yourEmail || !clientName || !clientEmail || !amount || !workDesc) {
    return res.status(400).json({ error: 'Missing required fields.' })
  }

  const claimId = uuidv4()

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [{
      price_data: {
        currency: 'usd',
        product_data: {
          name: 'Stiffed — Demand Letter Campaign',
          description: `3 escalating demand letters sent to ${clientName} for $${amount} owed.`
        },
        unit_amount: 2900
      },
      quantity: 1
    }],
    mode: 'payment',
    success_url: `${process.env.BASE_URL}/status?claim=${claimId}&success=true`,
    cancel_url: `${process.env.BASE_URL}/?cancelled=true`,
    metadata: { claimId }
  })

  // Store claim data before payment so we have it on webhook
  const claims = loadClaims()
  claims[claimId] = {
    id: claimId,
    status: 'pending_payment',
    yourName, yourEmail, yourJob,
    clientName, clientEmail,
    amount, daysOverdue, workDesc,
    createdAt: new Date().toISOString(),
    letters: [],
    sentAt: [],
    openedAt: []
  }
  saveClaims(claims)

  res.json({ url: session.url, claimId })
})

// Stripe webhook — fires after payment succeeds
app.post('/api/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  let event
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      req.headers['stripe-signature'],
      process.env.STRIPE_WEBHOOK_SECRET
    )
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`)
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object
    const claimId = session.metadata.claimId

    const claims = loadClaims()
    const claim = claims[claimId]
    if (!claim) return res.json({ received: true })

    try {
      // Generate letters with AI
      const letters = await generateLetters(claim)
      claim.letters = letters
      claim.status = 'active'
      claim.paidAt = new Date().toISOString()

      // Send Letter 1 immediately
      await sendEmail({
        to: claim.clientEmail,
        cc: claim.yourEmail,
        subject: letters.letter1.subject,
        body: letters.letter1.body
      })
      claim.sentAt[0] = new Date().toISOString()

      // Schedule Letter 2 for Day 8 (store timestamp, cron will pick it up)
      claim.sendLetter2At = new Date(Date.now() + 8 * 24 * 60 * 60 * 1000).toISOString()
      claim.sendLetter3At = new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString()

      // Notify freelancer
      await sendEmail({
        to: claim.yourEmail,
        cc: null,
        subject: `✓ Stiffed: Your claim against ${claim.clientName} is live`,
        body: `Hi ${claim.yourName},\n\nYour demand letter campaign against ${claim.clientName} is now active.\n\nLetter 1 was just sent to ${claim.clientEmail}.\nLetter 2 will be sent on ${new Date(claim.sendLetter2At).toLocaleDateString()}.\nLetter 3 will be sent on ${new Date(claim.sendLetter3At).toLocaleDateString()}.\n\nTrack your claim at: ${process.env.BASE_URL}/status?claim=${claimId}\n\nYou're CC'd on every letter, so you'll see exactly what your client sees.\n\n— Stiffed`
      })

      saveClaims(claims)
    } catch (err) {
      console.error('Failed to process claim:', err)
      claim.status = 'error'
      claim.error = err.message
      saveClaims(claims)
    }
  }

  res.json({ received: true })
})

// Get claim status
app.get('/api/claim/:id', (req, res) => {
  const claims = loadClaims()
  const claim = claims[req.params.id]
  if (!claim) return res.status(404).json({ error: 'Claim not found.' })

  // Don't expose full letter content or email addresses in status
  res.json({
    id: claim.id,
    status: claim.status,
    clientName: claim.clientName,
    amount: claim.amount,
    createdAt: claim.createdAt,
    paidAt: claim.paidAt,
    sentAt: claim.sentAt,
    sendLetter2At: claim.sendLetter2At,
    sendLetter3At: claim.sendLetter3At,
    lettersGenerated: claim.letters ? Object.keys(claim.letters).length : 0
  })
})

// Cron — check every hour for scheduled letters to send
import cron from 'node-cron'
cron.schedule('0 * * * *', async () => {
  const claims = loadClaims()
  const now = new Date()

  for (const claim of Object.values(claims)) {
    if (claim.status !== 'active') continue

    // Letter 2
    if (claim.sendLetter2At && !claim.sentAt[1] && new Date(claim.sendLetter2At) <= now) {
      try {
        await sendEmail({
          to: claim.clientEmail,
          cc: claim.yourEmail,
          subject: claim.letters.letter2.subject,
          body: claim.letters.letter2.body
        })
        claim.sentAt[1] = new Date().toISOString()
        console.log(`Sent Letter 2 for claim ${claim.id}`)
      } catch (err) {
        console.error(`Failed to send Letter 2 for ${claim.id}:`, err)
      }
    }

    // Letter 3
    if (claim.sendLetter3At && !claim.sentAt[2] && new Date(claim.sendLetter3At) <= now) {
      try {
        await sendEmail({
          to: claim.clientEmail,
          cc: claim.yourEmail,
          subject: claim.letters.letter3.subject,
          body: claim.letters.letter3.body
        })
        claim.sentAt[2] = new Date().toISOString()
        claim.status = 'completed'
        console.log(`Sent Letter 3 for claim ${claim.id}`)
      } catch (err) {
        console.error(`Failed to send Letter 3 for ${claim.id}:`, err)
      }
    }
  }

  saveClaims(claims)
})

// Serve frontend
const distPath = join(__dirname, 'dist')
if (existsSync(distPath)) {
  app.use(express.static(distPath))
  app.get('*', (req, res) => res.sendFile(join(distPath, 'index.html')))
}

const PORT = process.env.PORT || 3001
app.listen(PORT, () => console.log(`Stiffed server running on http://localhost:${PORT}`))
