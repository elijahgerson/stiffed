export default function LandingScreen({ onStart }) {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>

      {/* NAV */}
      <nav style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '20px 40px', borderBottom: '1px solid #e0e0e0',
        background: '#fafafa', position: 'sticky', top: 0, zIndex: 100
      }}>
        <span style={{ fontSize: 22, fontWeight: 900, letterSpacing: -0.5 }}>
          Stiffed<span style={{ color: '#e63329' }}>.</span>
        </span>
        <button onClick={onStart} style={{
          background: '#0a0a0a', color: '#fff', border: 'none',
          padding: '10px 22px', borderRadius: 8, fontWeight: 700,
          fontSize: 14, cursor: 'pointer'
        }}>
          File a Claim — $29
        </button>
      </nav>

      {/* HERO */}
      <section style={{ maxWidth: 760, margin: '0 auto', padding: '100px 40px 80px', textAlign: 'center' }}>
        <div style={{
          display: 'inline-block', background: '#fff0f0', color: '#e63329',
          fontSize: 13, fontWeight: 700, padding: '6px 16px', borderRadius: 20,
          marginBottom: 28, letterSpacing: 0.3
        }}>
          For freelancers who are done being nice about it
        </div>

        <h1 style={{
          fontSize: 'clamp(44px, 7vw, 70px)', fontWeight: 900,
          letterSpacing: -2, lineHeight: 1.05, marginBottom: 24
        }}>
          Your client won't pay.<br />
          <span style={{ color: '#e63329' }}>Make it their problem.</span>
        </h1>

        <p style={{ fontSize: 19, color: '#6b6b6b', maxWidth: 540, margin: '0 auto 48px', lineHeight: 1.6 }}>
          Stiffed sends three escalating legal demand letters to your client — automatically.
          Most clients pay after letter two.
        </p>

        <button onClick={onStart} style={{
          background: '#e63329', color: '#fff', border: 'none',
          padding: '18px 40px', borderRadius: 10, fontSize: 18,
          fontWeight: 800, cursor: 'pointer', display: 'inline-block'
        }}>
          Start My Claim — $29
        </button>
        <p style={{ marginTop: 12, fontSize: 13, color: '#999' }}>
          One-time · No subscription · Takes 3 minutes
        </p>

        {/* STATS */}
        <div style={{
          display: 'flex', justifyContent: 'center', gap: 48,
          marginTop: 64, paddingTop: 48, borderTop: '1px solid #e0e0e0',
          flexWrap: 'wrap'
        }}>
          {[['83%', 'of clients pay after letter 2'], ['$29', 'flat, no hidden fees'], ['3 min', 'to file a claim']].map(([num, label]) => (
            <div key={num} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 36, fontWeight: 900, letterSpacing: -1 }}>{num}</div>
              <div style={{ fontSize: 13, color: '#6b6b6b', marginTop: 4 }}>{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section style={{ padding: '80px 40px', background: '#fff' }}>
        <div style={{ maxWidth: 880, margin: '0 auto' }}>
          <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', color: '#e63329', marginBottom: 12 }}>How it works</p>
          <h2 style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 900, letterSpacing: -1, marginBottom: 56 }}>
            Three steps to getting paid.
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 32 }}>
            {[
              { n: 1, title: 'Tell us what happened', desc: 'Your name, their email, the amount, and what the work was. Under 3 minutes.' },
              { n: 2, title: 'We send the letters', desc: 'Three AI-written demand letters go out on Day 1, Day 8, and Day 15. You\'re CC\'d on every one.' },
              { n: 3, title: 'You get paid', desc: 'If they still ignore it, we generate your small claims filing — ready for your county.' }
            ].map(s => (
              <div key={s.n} style={{ padding: 32, border: '1.5px solid #e0e0e0', borderRadius: 14 }}>
                <div style={{
                  width: 40, height: 40, background: '#0a0a0a', color: '#fff',
                  borderRadius: '50%', display: 'flex', alignItems: 'center',
                  justifyContent: 'center', fontWeight: 800, marginBottom: 16
                }}>{s.n}</div>
                <h3 style={{ fontSize: 17, fontWeight: 800, marginBottom: 8 }}>{s.title}</h3>
                <p style={{ fontSize: 14, color: '#6b6b6b', lineHeight: 1.6 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* LETTERS */}
      <section style={{ padding: '80px 40px', background: '#0a0a0a', color: '#fafafa' }}>
        <div style={{ maxWidth: 880, margin: '0 auto' }}>
          <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', color: '#ff6b6b', marginBottom: 12 }}>The escalation sequence</p>
          <h2 style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 900, letterSpacing: -1, marginBottom: 12 }}>
            Three letters. Increasing pressure.
          </h2>
          <p style={{ color: '#888', fontSize: 16, marginBottom: 48 }}>Written by AI, specific to your situation, sent from a professional domain.</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 20 }}>
            {[
              { day: 'Day 1', color: '#ffd166', bg: '#2a2200', label: 'Firm & professional', title: 'Firm Reminder', desc: 'References the exact work, amount, and days overdue. Professional tone — serious but not threatening.' },
              { day: 'Day 8', color: '#f4a261', bg: '#2a1500', label: 'Legal & urgent', title: 'Legal Notice', desc: 'References contract law, states intent to pursue legal remedies. 83% of clients respond here.' },
              { day: 'Day 15', color: '#ff6b6b', bg: '#2a0800', label: 'Final warning', title: 'Final Demand', desc: 'States small claims paperwork is prepared and will be filed in 72 hours. Includes full judgment amount.' }
            ].map(l => (
              <div key={l.day} style={{ background: '#161616', border: '1px solid #2a2a2a', borderRadius: 14, padding: 28 }}>
                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', color: l.color, marginBottom: 14 }}>{l.day}</div>
                <h4 style={{ fontSize: 16, fontWeight: 800, marginBottom: 10 }}>{l.title}</h4>
                <p style={{ fontSize: 14, color: '#888', lineHeight: 1.6, marginBottom: 16 }}>{l.desc}</p>
                <span style={{ background: l.bg, color: l.color, fontSize: 12, fontWeight: 600, padding: '6px 12px', borderRadius: 6 }}>{l.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section style={{ padding: '80px 40px', background: '#fff' }}>
        <div style={{ maxWidth: 880, margin: '0 auto' }}>
          <h2 style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 900, letterSpacing: -1, marginBottom: 48, textAlign: 'center' }}>
            Freelancers who got paid.
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 24 }}>
            {[
              { q: '"Client owed me $3,200 for 4 months. Money was in my account 3 days after the first letter. I actually cried."', name: 'Sara K.', role: 'Freelance copywriter' },
              { q: '"I was too scared to follow up myself. Stiffed did it for me and somehow I still got a good review."', name: 'Marcus R.', role: 'Brand designer' },
              { q: '"Used it twice. Both paid before letter 3. $29 to recover $8,000 total. The math is obvious."', name: 'Jamie L.', role: 'Web developer' }
            ].map(t => (
              <div key={t.name} style={{ padding: 28, border: '1.5px solid #e0e0e0', borderRadius: 14 }}>
                <p style={{ fontSize: 15, lineHeight: 1.7, marginBottom: 20, color: '#333' }}>{t.q}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{
                    width: 40, height: 40, borderRadius: '50%', background: '#0a0a0a',
                    color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontWeight: 800, fontSize: 14
                  }}>{t.name.split(' ').map(n => n[0]).join('')}</div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 14 }}>{t.name}</div>
                    <div style={{ fontSize: 13, color: '#6b6b6b' }}>{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section style={{ padding: '100px 40px', background: '#0a0a0a', color: '#fafafa', textAlign: 'center' }}>
        <h2 style={{ fontSize: 'clamp(36px, 6vw, 64px)', fontWeight: 900, letterSpacing: -2, marginBottom: 16, lineHeight: 1.05 }}>
          Stop being <span style={{ color: '#e63329' }}>nice</span> about it.
        </h2>
        <p style={{ color: '#888', fontSize: 18, marginBottom: 40 }}>They've had enough chances. $29 to make it their problem.</p>
        <button onClick={onStart} style={{
          background: '#e63329', color: '#fff', border: 'none',
          padding: '18px 44px', borderRadius: 10, fontSize: 18,
          fontWeight: 800, cursor: 'pointer'
        }}>
          File a Claim — $29
        </button>
      </section>

      {/* FOOTER */}
      <footer style={{ padding: '28px 40px', borderTop: '1px solid #e0e0e0', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <span style={{ fontSize: 18, fontWeight: 900 }}>Stiffed<span style={{ color: '#e63329' }}>.</span></span>
        <span style={{ fontSize: 13, color: '#999' }}>Not a law firm. Not legal advice. Just results.</span>
      </footer>
    </div>
  )
}
