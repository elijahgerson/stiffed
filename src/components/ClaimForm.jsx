import { useState } from 'react'

const STEPS = ['Your info', 'Their info', 'Review & pay']

export default function ClaimForm({ onBack }) {
  const [step, setStep] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    yourName: '', yourEmail: '', yourJob: '',
    clientName: '', clientEmail: '',
    amount: '', daysOverdue: '', workDesc: ''
  })

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const inputStyle = {
    width: '100%', padding: '12px 16px', border: '2px solid #e0e0e0',
    borderRadius: 8, fontSize: 15, outline: 'none', fontFamily: 'inherit',
    background: '#fff', transition: 'border-color 0.15s'
  }

  const labelStyle = { display: 'block', fontSize: 13, fontWeight: 700, marginBottom: 6 }

  async function handleSubmit() {
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Something went wrong.')
      window.location.href = data.url
    } catch (err) {
      setError(err.message)
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f7f7f5' }}>
      {/* NAV */}
      <nav style={{
        display: 'flex', alignItems: 'center', gap: 16,
        padding: '20px 40px', borderBottom: '1px solid #e0e0e0', background: '#fafafa'
      }}>
        <button onClick={onBack} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 14, color: '#6b6b6b', fontWeight: 600 }}>← Back</button>
        <span style={{ fontSize: 20, fontWeight: 900 }}>Stiffed<span style={{ color: '#e63329' }}>.</span></span>
      </nav>

      <div style={{ maxWidth: 560, margin: '0 auto', padding: '60px 24px' }}>
        {/* Step indicator */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 40, alignItems: 'center' }}>
          {STEPS.map((s, i) => (
            <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{
                width: 28, height: 28, borderRadius: '50%',
                background: i === step ? '#e63329' : i < step ? '#0a0a0a' : '#e0e0e0',
                color: i <= step ? '#fff' : '#999',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 13, fontWeight: 700, flexShrink: 0
              }}>{i < step ? '✓' : i + 1}</div>
              <span style={{ fontSize: 13, fontWeight: 600, color: i === step ? '#0a0a0a' : '#999', whiteSpace: 'nowrap' }}>{s}</span>
              {i < STEPS.length - 1 && <div style={{ width: 24, height: 1, background: '#e0e0e0', marginLeft: 4 }} />}
            </div>
          ))}
        </div>

        <div style={{ background: '#fff', borderRadius: 16, padding: 40, border: '1.5px solid #e0e0e0' }}>

          {/* Step 0: Your info */}
          {step === 0 && (
            <div className="fade-up">
              <h2 style={{ fontSize: 24, fontWeight: 900, marginBottom: 6 }}>Your information</h2>
              <p style={{ color: '#6b6b6b', fontSize: 15, marginBottom: 28 }}>Who are we fighting for?</p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                <div>
                  <label style={labelStyle}>First name</label>
                  <input style={inputStyle} value={form.yourName.split(' ')[0]} onChange={e => set('yourName', e.target.value + ' ' + (form.yourName.split(' ')[1] || ''))} placeholder="Alex" />
                </div>
                <div>
                  <label style={labelStyle}>Last name</label>
                  <input style={inputStyle} value={form.yourName.split(' ')[1] || ''} onChange={e => set('yourName', (form.yourName.split(' ')[0] || '') + ' ' + e.target.value)} placeholder="Johnson" />
                </div>
              </div>
              <div style={{ marginBottom: 16 }}>
                <label style={labelStyle}>Your email</label>
                <input style={inputStyle} type="email" value={form.yourEmail} onChange={e => set('yourEmail', e.target.value)} placeholder="you@example.com" />
              </div>
              <div style={{ marginBottom: 28 }}>
                <label style={labelStyle}>Your profession</label>
                <input style={inputStyle} value={form.yourJob} onChange={e => set('yourJob', e.target.value)} placeholder="Freelance designer, copywriter, developer..." />
              </div>
              <button onClick={() => setStep(1)} style={{
                width: '100%', background: '#0a0a0a', color: '#fff', border: 'none',
                padding: 16, borderRadius: 10, fontSize: 16, fontWeight: 700, cursor: 'pointer'
              }}>
                Next: Their info →
              </button>
            </div>
          )}

          {/* Step 1: Client info */}
          {step === 1 && (
            <div className="fade-up">
              <h2 style={{ fontSize: 24, fontWeight: 900, marginBottom: 6 }}>Who owes you?</h2>
              <p style={{ color: '#6b6b6b', fontSize: 15, marginBottom: 28 }}>Tell us about your client.</p>
              <div style={{ marginBottom: 16 }}>
                <label style={labelStyle}>Client name or company</label>
                <input style={inputStyle} value={form.clientName} onChange={e => set('clientName', e.target.value)} placeholder="Acme Corp or John Smith" />
              </div>
              <div style={{ marginBottom: 16 }}>
                <label style={labelStyle}>Client email</label>
                <input style={inputStyle} type="email" value={form.clientEmail} onChange={e => set('clientEmail', e.target.value)} placeholder="client@theirdomain.com" />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                <div>
                  <label style={labelStyle}>Amount owed ($)</label>
                  <input style={inputStyle} type="number" value={form.amount} onChange={e => set('amount', e.target.value)} placeholder="2500" />
                </div>
                <div>
                  <label style={labelStyle}>Days overdue</label>
                  <input style={inputStyle} type="number" value={form.daysOverdue} onChange={e => set('daysOverdue', e.target.value)} placeholder="30" />
                </div>
              </div>
              <div style={{ marginBottom: 28 }}>
                <label style={labelStyle}>What was the work?</label>
                <textarea
                  style={{ ...inputStyle, resize: 'vertical', minHeight: 90 }}
                  value={form.workDesc}
                  onChange={e => set('workDesc', e.target.value)}
                  placeholder="Website redesign, brand identity, 3 months of content writing..."
                />
              </div>
              <div style={{ display: 'flex', gap: 12 }}>
                <button onClick={() => setStep(0)} style={{
                  flex: 1, background: 'none', border: '2px solid #e0e0e0',
                  padding: 14, borderRadius: 10, fontSize: 15, fontWeight: 600, cursor: 'pointer'
                }}>← Back</button>
                <button onClick={() => setStep(2)} style={{
                  flex: 2, background: '#0a0a0a', color: '#fff', border: 'none',
                  padding: 14, borderRadius: 10, fontSize: 15, fontWeight: 700, cursor: 'pointer'
                }}>Review & Pay →</button>
              </div>
            </div>
          )}

          {/* Step 2: Review */}
          {step === 2 && (
            <div className="fade-up">
              <h2 style={{ fontSize: 24, fontWeight: 900, marginBottom: 6 }}>Review your claim</h2>
              <p style={{ color: '#6b6b6b', fontSize: 15, marginBottom: 28 }}>Confirm everything looks right before paying.</p>

              {[
                ['Claimant', form.yourName + ' · ' + form.yourEmail],
                ['Profession', form.yourJob],
                ['Client', form.clientName + ' · ' + form.clientEmail],
                ['Amount owed', '$' + form.amount],
                ['Days overdue', form.daysOverdue + ' days'],
                ['Work performed', form.workDesc]
              ].map(([label, value]) => (
                <div key={label} style={{ display: 'flex', gap: 16, padding: '12px 0', borderBottom: '1px solid #f0f0f0' }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: '#999', minWidth: 110 }}>{label}</span>
                  <span style={{ fontSize: 14, color: '#0a0a0a', lineHeight: 1.5 }}>{value}</span>
                </div>
              ))}

              <div style={{ background: '#fff8f8', border: '1.5px solid #ffd0d0', borderRadius: 10, padding: 16, margin: '24px 0' }}>
                <p style={{ fontSize: 13, fontWeight: 700, marginBottom: 4 }}>What happens next:</p>
                <p style={{ fontSize: 13, color: '#555', lineHeight: 1.6 }}>
                  After payment, we generate 3 custom demand letters and send Letter 1 to {form.clientEmail} immediately.
                  You'll be CC'd on every letter. Letter 2 goes out Day 8, Letter 3 on Day 15.
                </p>
              </div>

              {error && (
                <div style={{ background: '#fff0f0', border: '1px solid #ffd0d0', borderRadius: 8, padding: 14, marginBottom: 16, fontSize: 14, color: '#c0271e' }}>
                  {error}
                </div>
              )}

              <div style={{ display: 'flex', gap: 12 }}>
                <button onClick={() => setStep(1)} style={{
                  flex: 1, background: 'none', border: '2px solid #e0e0e0',
                  padding: 14, borderRadius: 10, fontSize: 15, fontWeight: 600, cursor: 'pointer'
                }}>← Edit</button>
                <button onClick={handleSubmit} disabled={loading} style={{
                  flex: 2, background: '#e63329', color: '#fff', border: 'none',
                  padding: 14, borderRadius: 10, fontSize: 15, fontWeight: 700,
                  cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1
                }}>
                  {loading ? 'Redirecting to payment...' : 'Pay $29 & Send Letters'}
                </button>
              </div>
              <p style={{ textAlign: 'center', fontSize: 12, color: '#999', marginTop: 12 }}>
                Secure payment via Stripe · One-time charge · No subscription
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
