import { useState, useEffect } from 'react'

export default function StatusScreen({ claimId }) {
  const [claim, setClaim] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch(`/api/claim/${claimId}`)
      .then(r => r.json())
      .then(data => {
        if (data.error) setError(data.error)
        else setClaim(data)
      })
      .catch(() => setError('Could not load claim.'))
  }, [claimId])

  const formatDate = iso => new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })

  const letters = [
    { label: 'Letter 1 — Firm Reminder', sentAt: claim?.sentAt?.[0], scheduledAt: null },
    { label: 'Letter 2 — Legal Notice', sentAt: claim?.sentAt?.[1], scheduledAt: claim?.sendLetter2At },
    { label: 'Letter 3 — Final Demand', sentAt: claim?.sentAt?.[2], scheduledAt: claim?.sendLetter3At }
  ]

  return (
    <div style={{ minHeight: '100vh', background: '#f7f7f5' }}>
      <nav style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '20px 40px', borderBottom: '1px solid #e0e0e0', background: '#fafafa'
      }}>
        <span style={{ fontSize: 20, fontWeight: 900 }}>Stiffed<span style={{ color: '#e63329' }}>.</span></span>
        <a href="/" style={{ fontSize: 14, color: '#6b6b6b', fontWeight: 600, textDecoration: 'none' }}>File another claim</a>
      </nav>

      <div style={{ maxWidth: 560, margin: '0 auto', padding: '60px 24px' }}>
        {error && (
          <div style={{ background: '#fff0f0', border: '1px solid #ffd0d0', borderRadius: 10, padding: 24, textAlign: 'center', color: '#c0271e' }}>
            {error}
          </div>
        )}

        {!claim && !error && (
          <div style={{ textAlign: 'center', color: '#6b6b6b', animation: 'pulse 1.5s infinite' }}>
            Loading your claim...
          </div>
        )}

        {claim && (
          <div className="fade-up">
            {/* Success header */}
            <div style={{ textAlign: 'center', marginBottom: 40 }}>
              <div style={{
                width: 64, height: 64, background: '#e8f5e9', borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 28, margin: '0 auto 20px'
              }}>✓</div>
              <h1 style={{ fontSize: 28, fontWeight: 900, marginBottom: 8 }}>Your claim is live.</h1>
              <p style={{ color: '#6b6b6b', fontSize: 16 }}>
                Letter 1 is on its way to <strong>{claim.clientName}</strong>.<br />
                Check your email — you're CC'd on everything.
              </p>
            </div>

            {/* Claim summary */}
            <div style={{ background: '#fff', borderRadius: 14, padding: 28, border: '1.5px solid #e0e0e0', marginBottom: 24 }}>
              <h3 style={{ fontSize: 16, fontWeight: 800, marginBottom: 16 }}>Claim summary</h3>
              {[
                ['Client', claim.clientName],
                ['Amount', '$' + claim.amount],
                ['Filed', formatDate(claim.createdAt)],
                ['Status', claim.status === 'active' ? '🟢 Active' : claim.status === 'completed' ? '✓ Completed' : claim.status]
              ].map(([label, value]) => (
                <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #f5f5f5' }}>
                  <span style={{ fontSize: 13, color: '#999', fontWeight: 600 }}>{label}</span>
                  <span style={{ fontSize: 14, fontWeight: 700 }}>{value}</span>
                </div>
              ))}
            </div>

            {/* Letter timeline */}
            <div style={{ background: '#fff', borderRadius: 14, padding: 28, border: '1.5px solid #e0e0e0' }}>
              <h3 style={{ fontSize: 16, fontWeight: 800, marginBottom: 20 }}>Letter timeline</h3>
              {letters.map((l, i) => (
                <div key={i} style={{ display: 'flex', gap: 16, marginBottom: i < 2 ? 20 : 0 }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: '50%', flexShrink: 0,
                    background: l.sentAt ? '#0a0a0a' : '#f0f0f0',
                    color: l.sentAt ? '#fff' : '#999',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 14, fontWeight: 800
                  }}>{l.sentAt ? '✓' : i + 1}</div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700 }}>{l.label}</div>
                    <div style={{ fontSize: 13, color: '#6b6b6b', marginTop: 2 }}>
                      {l.sentAt
                        ? `Sent ${formatDate(l.sentAt)}`
                        : l.scheduledAt
                        ? `Scheduled for ${formatDate(l.scheduledAt)}`
                        : 'Pending'}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <p style={{ textAlign: 'center', fontSize: 13, color: '#999', marginTop: 24 }}>
              Bookmark this page to track your claim. Claim ID: <code style={{ fontSize: 12 }}>{claimId}</code>
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
