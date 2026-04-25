export default function DesignMiniPreview({ id, colors }) {
  if (id.startsWith('classic-pro')) {
    const { primary, accent, bg } = colors;
    return (
      <div style={{ fontFamily: 'Georgia, serif', padding: 12, background: bg, height: '100%', color: primary }}>
        <div style={{ borderBottom: `2px solid ${primary}`, paddingBottom: 6, marginBottom: 8 }}>
          <div style={{ fontWeight: 700, fontSize: 10, color: primary }}>JOHN DOE</div>
          <div style={{ fontSize: 7, color: accent }}>john@email.com • +91 98765 43210</div>
        </div>
        {['EXPERIENCE', 'EDUCATION', 'SKILLS'].map(s => (
          <div key={s} style={{ marginBottom: 6 }}>
            <div style={{ background: primary, color: '#fff', fontSize: 6, padding: '1px 4px', marginBottom: 3, letterSpacing: 1 }}>{s}</div>
            <div style={{ fontSize: 6, color: accent, lineHeight: 1.5 }}>
              <div style={{ fontWeight: 600 }}>Title at Company</div>
              <div style={{ color: accent, opacity: 0.8 }}>• Achieved result with 40% improvement</div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (id.startsWith('modern-split')) {
    const { sidebar, accent, bg } = colors;
    return (
      <div style={{ display: 'flex', height: '100%', fontFamily: 'Inter, sans-serif' }}>
        <div style={{ width: '35%', background: sidebar, padding: 10, color: '#fff' }}>
          <div style={{ width: 28, height: 28, borderRadius: '50%', background: accent, margin: '0 auto 6px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700 }}>J</div>
          <div style={{ fontSize: 6, marginBottom: 8, borderBottom: '1px solid rgba(255,255,255,0.2)', paddingBottom: 6 }}>
            <div style={{ fontWeight: 600, marginBottom: 2 }}>CONTACT</div>
            <div style={{ color: 'rgba(255,255,255,0.6)', lineHeight: 1.6 }}>email@co.com<br />+91 98765<br />Mumbai</div>
          </div>
          <div style={{ fontSize: 6 }}>
            <div style={{ fontWeight: 600, marginBottom: 2 }}>SKILLS</div>
            {['React', 'Node.js', 'Python'].map(s => (
              <div key={s} style={{ background: accent, borderRadius: 8, padding: '1px 4px', marginBottom: 2, fontSize: 5 }}>{s}</div>
            ))}
          </div>
        </div>
        <div style={{ flex: 1, padding: 10, background: bg, color: sidebar }}>
          <div style={{ fontSize: 9, fontWeight: 700, marginBottom: 2 }}>JOHN DOE</div>
          <div style={{ fontSize: 6, color: accent, marginBottom: 6 }}>Software Engineer</div>
          {['EXPERIENCE', 'EDUCATION'].map(s => (
            <div key={s} style={{ marginBottom: 6 }}>
              <div style={{ fontSize: 6, fontWeight: 700, color: sidebar, borderBottom: `1px solid ${accent}`, marginBottom: 3 }}>{s}</div>
              <div style={{ fontSize: 5, color: '#444', lineHeight: 1.5 }}>Developer at TCS<br />• Built REST APIs</div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (id.startsWith('creative-edge')) {
    const { grad1, grad2, accent, badge, badgeText } = colors;
    return (
      <div style={{ fontFamily: 'Poppins, sans-serif', height: '100%', background: '#fff' }}>
        <div style={{ background: `linear-gradient(135deg, ${grad1}, ${grad2})`, padding: '14px 12px', color: '#fff' }}>
          <div style={{ fontSize: 10, fontWeight: 700 }}>JOHN DOE</div>
          <div style={{ fontSize: 6, opacity: 0.8 }}>Software Engineer</div>
          <div style={{ display: 'flex', gap: 4, marginTop: 4 }}>
            {['email', 'phone', 'github'].map(i => (
              <span key={i} style={{ background: 'rgba(255,255,255,0.15)', borderRadius: 8, padding: '1px 5px', fontSize: 5 }}>{i}</span>
            ))}
          </div>
        </div>
        <div style={{ padding: 10 }}>
          {['EXPERIENCE', 'SKILLS'].map(s => (
            <div key={s} style={{ marginBottom: 7 }}>
              <div style={{ fontSize: 7, fontWeight: 700, color: accent, marginBottom: 3 }}>{s}</div>
              <div style={{ fontSize: 5, color: '#333', lineHeight: 1.6 }}>
                {s === 'SKILLS'
                  ? <div style={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
                      {['React', 'Node', 'SQL'].map(sk => (
                        <span key={sk} style={{ background: badge, color: badgeText, borderRadius: 8, padding: '1px 5px', fontSize: 5 }}>{sk}</span>
                      ))}
                    </div>
                  : <div>Developer at Company<br />• Key achievement +30%</div>}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (id.startsWith('minimal-clean')) {
    const { primary, accent, line, bg } = colors;
    return (
      <div style={{ fontFamily: 'Georgia, serif', padding: 11, background: bg, height: '100%' }}>
        {/* Header */}
        <div style={{ borderBottom: `2px solid ${primary}`, paddingBottom: 6, marginBottom: 7 }}>
          <div style={{ fontWeight: 900, fontSize: 10, color: primary, letterSpacing: -0.5 }}>JOHN DOE</div>
          <div style={{ fontSize: 6, color: accent, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 3 }}>Senior Engineer</div>
          <div style={{ fontSize: 5, color: '#444', display: 'flex', gap: 5, flexWrap: 'wrap' }}>
            {['Mumbai', '+91 98765', 'john@email.com'].map(c => (
              <span key={c}><span style={{ color: accent }}>● </span>{c}</span>
            ))}
          </div>
        </div>
        {/* Sections */}
        {['Experience', 'Skills'].map(s => (
          <div key={s} style={{ marginBottom: 6 }}>
            <div style={{ fontSize: 6, fontWeight: 700, color: primary, textTransform: 'uppercase', letterSpacing: 1.5, borderBottom: `1px solid ${line}`, paddingBottom: 2, marginBottom: 3, position: 'relative' }}>
              {s}
              <span style={{ position: 'absolute', bottom: -1, left: 0, width: 12, height: 1.5, background: accent, display: 'block' }} />
            </div>
            <div style={{ fontSize: 5, color: '#2d3748', lineHeight: 1.6 }}>
              {s === 'Skills'
                ? <span style={{ color: '#4a5568' }}>React · Node.js · AWS · SQL</span>
                : <div>
                    <div style={{ fontWeight: 700, color: primary }}>Engineer at Razorpay</div>
                    <div style={{ color: accent, fontSize: 5 }}>2023 – Present</div>
                    <div style={{ color: '#555' }}>▸ Reduced latency by 42%</div>
                  </div>}
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (id.startsWith('executive-pro')) {
    const { sidebar1, sidebar2, accent, accentDark } = colors;
    return (
      <div style={{ display: 'flex', height: '100%', fontFamily: 'Georgia, serif' }}>
        <div style={{ width: '38%', background: `linear-gradient(170deg, ${sidebar1}, ${sidebar2})`, padding: 10, color: '#fff', position: 'relative' }}>
          <div style={{ position: 'absolute', top: 0, right: 0, width: 3, height: '100%', background: accent }} />
          <div style={{ width: 26, height: 26, borderRadius: '50%', background: `linear-gradient(135deg, ${accent}, ${accentDark})`, margin: '0 auto 6px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, fontWeight: 900, color: sidebar1 }}>JD</div>
          <div style={{ fontSize: 6, marginBottom: 7, borderBottom: `1px solid rgba(246,173,60,0.3)`, paddingBottom: 5 }}>
            <div style={{ color: accent, fontWeight: 700, letterSpacing: 1, fontSize: 5, textTransform: 'uppercase', marginBottom: 3 }}>Contact</div>
            <div style={{ color: 'rgba(255,255,255,0.7)', lineHeight: 1.7, fontSize: 5 }}>email@co.com<br />+91 98765<br />Mumbai</div>
          </div>
          <div style={{ fontSize: 5 }}>
            <div style={{ color: accent, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 3 }}>Skills</div>
            {['Strategy', 'Analytics', 'SEO'].map(s => (
              <div key={s} style={{ background: 'rgba(255,255,255,0.1)', borderRadius: 6, padding: '1px 4px', marginBottom: 2, color: '#e2e8f0', fontSize: 5 }}>{s}</div>
            ))}
          </div>
        </div>
        <div style={{ flex: 1, padding: 10, background: '#fff', color: sidebar1 }}>
          <div style={{ fontFamily: 'Georgia, serif', fontSize: 10, fontWeight: 900, color: sidebar1, letterSpacing: -0.5, marginBottom: 1 }}>John Doe</div>
          <div style={{ fontSize: 5, color: accentDark, textTransform: 'uppercase', letterSpacing: 2, marginBottom: 6, paddingBottom: 5, borderBottom: '2px solid #edf2f7', position: 'relative' }}>
            Senior Manager
            <div style={{ position: 'absolute', bottom: -2, left: 0, width: 20, height: 2, background: accentDark }} />
          </div>
          {['Experience', 'Education'].map(s => (
            <div key={s} style={{ marginBottom: 6 }}>
              <div style={{ fontSize: 6, fontWeight: 700, color: sidebar1, marginBottom: 3, display: 'flex', alignItems: 'center', gap: 4 }}>
                <span style={{ width: 10, height: 1.5, background: accentDark, display: 'inline-block' }} />{s}
              </div>
              <div style={{ paddingLeft: 8, borderLeft: '1.5px solid #e2e8f0', fontSize: 5, color: '#4a5568', lineHeight: 1.6 }}>
                <div style={{ fontWeight: 700, color: sidebar1 }}>Role at Company</div>
                <div>• Key achievement result</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return null;
}
