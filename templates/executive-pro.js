const { escHtml, skillsList, educationSection } = require('../lib/resume-helpers');

const THEMES = {
  'executive-pro':           { sidebar1: '#1e3a5f', sidebar2: '#2c5282', accent: '#f6ad3c', accentDark: '#ed8936' },
  'executive-pro-green':     { sidebar1: '#1a3d2b', sidebar2: '#2d6a4f', accent: '#f6ad3c', accentDark: '#52b788' },
  'executive-pro-charcoal':  { sidebar1: '#2d3748', sidebar2: '#4a5568', accent: '#f6ad3c', accentDark: '#e2b96f' },
  'executive-pro-burgundy':  { sidebar1: '#4a0e2c', sidebar2: '#7b1d46', accent: '#f6ad3c', accentDark: '#f48fb1' },
};

function generateHTML(resume, profilePhoto, theme) {
  const { sidebar1, sidebar2, accent, accentDark } = theme;
  const skills    = (resume.skills?.technical || []);
  const softSkills = (resume.skills?.soft || []);
  const tools     = (resume.techStack || []);
  const certs     = (resume.certifications || []).filter(Boolean);
  const exp       = (resume.experience || []).filter(e => e.title);
  const intern    = (resume.internships || []).filter(e => e.role);
  const edu       = (resume.education || []).filter(e => e.degree);
  const projects  = (resume.projects || []).filter(p => p.name);
  const achieve   = (resume.achievements || []).filter(Boolean);

  // Profile photo or initials
  const initials = (resume.name || 'NA').split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase();
  const photoEl  = profilePhoto
    ? `<img src="${profilePhoto}" alt="Profile" style="width:100px;height:100px;border-radius:50%;object-fit:cover;border:3px solid rgba(255,255,255,0.2);margin:0 auto 16px;display:block;" />`
    : `<div style="width:100px;height:100px;border-radius:50%;background:linear-gradient(135deg,${accent} 0%,${accentDark} 100%);margin:0 auto 16px;display:flex;align-items:center;justify-content:center;font-family:'Playfair Display',Georgia,serif;font-size:36px;font-weight:900;color:${sidebar1};border:3px solid rgba(255,255,255,0.2);">${initials}</div>`;

  // Timeline entries (experience + internships)
  function timelineEntry(role, company, duration, bullets) {
    return `
    <div style="position:relative;margin-bottom:14px;padding-left:20px;">
      <div style="position:absolute;left:0px;top:4px;width:12px;height:12px;background:${accentDark};border:2px solid #fff;border-radius:50%;box-shadow:0 0 0 2px ${accentDark};"></div>
      <div style="display:flex;justify-content:space-between;align-items:baseline;flex-wrap:wrap;gap:6px;margin-bottom:2px;">
        <span style="font-size:13.5px;font-weight:700;color:${sidebar1};">${escHtml(role)}</span>
        <span style="font-size:11px;font-weight:600;color:#fff;background:${accentDark};padding:2px 9px;border-radius:10px;white-space:nowrap;">${escHtml(duration)}</span>
      </div>
      <div style="font-size:12px;font-weight:600;color:#4a5568;margin-bottom:6px;">${escHtml(company)}</div>
      ${bullets?.length ? `<ul style="list-style:none;padding:0;">${bullets.map(b => `<li style="font-size:11.5px;line-height:1.55;color:#4a5568;padding-left:14px;position:relative;margin-bottom:3px;"><span style="position:absolute;left:0;color:${accentDark};font-weight:bold;font-size:14px;line-height:1.3;">›</span>${escHtml(b)}</li>`).join('')}</ul>` : ''}
    </div>`;
  }

  // Education timeline entries
  function eduEntry(e) {
    return `
    <div style="position:relative;margin-bottom:14px;padding-left:20px;">
      <div style="position:absolute;left:0px;top:4px;width:12px;height:12px;background:${accentDark};border:2px solid #fff;border-radius:50%;box-shadow:0 0 0 2px ${accentDark};"></div>
      <div style="display:flex;justify-content:space-between;align-items:baseline;flex-wrap:wrap;gap:6px;margin-bottom:2px;">
        <span style="font-size:13.5px;font-weight:700;color:${sidebar1};">${escHtml(e.degree)}</span>
        <span style="font-size:11px;font-weight:600;color:#fff;background:${accentDark};padding:2px 9px;border-radius:10px;">${escHtml(e.year)}</span>
      </div>
      <div style="font-size:12px;font-weight:600;color:#4a5568;margin-bottom:4px;">${escHtml(e.institution)}</div>
      ${e.score ? `<div style="font-size:11px;color:#718096;">${escHtml(e.score)}</div>` : ''}
    </div>`;
  }

  return `<!DOCTYPE html><html><head><meta charset="utf-8">
<style>
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=Inter:wght@400;500;600;700&display=swap');
  * { margin:0; padding:0; box-sizing:border-box; }
  body { font-family:'Inter',-apple-system,sans-serif; background:#fff; color:#1a202c; line-height:1.5; font-size:13px; display:grid; grid-template-columns:220px 1fr; min-height:1123px; }
  .sidebar { background:linear-gradient(170deg,${sidebar1} 0%,${sidebar2} 100%); color:#fff; padding:32px 18px; position:relative; }
  .sidebar::before { content:''; position:absolute; top:0; right:0; width:4px; height:100%; background:${accent}; }
  .sb-title { font-size:10px; font-weight:700; letter-spacing:2.5px; text-transform:uppercase; color:${accent}; padding-bottom:5px; margin-bottom:9px; border-bottom:1.5px solid rgba(246,173,60,0.3); }
  .sb-section { margin-bottom:16px; }
  .sb-contact { font-size:10px; color:#e2e8f0; margin-bottom:6px; display:flex; gap:7px; }
  .sb-contact .ic { color:${accent}; min-width:12px; }
  .tag { background:rgba(246,173,60,0.15); border:1px solid rgba(246,173,60,0.4); color:${accent}; padding:3px 8px; border-radius:12px; font-size:9.5px; font-weight:600; display:inline-block; margin:2px 2px 2px 0; }
  .sb-list { list-style:none; }
  .sb-list li { font-size:10px; color:#e2e8f0; padding:4px 0 4px 13px; position:relative; border-bottom:1px solid rgba(255,255,255,0.07); line-height:1.4; }
  .sb-list li:last-child { border-bottom:none; }
  .sb-list li::before { content:'◆'; position:absolute; left:0; color:${accent}; font-size:7px; top:6px; }
  .sb-list li strong { display:block; color:#fff; font-weight:600; }
  .sb-list li .meta { color:#a0aec0; font-size:9px; }
  .skill-tag { background:rgba(255,255,255,0.1); border:1px solid rgba(255,255,255,0.2); color:#e2e8f0; padding:3px 8px; border-radius:10px; font-size:9.5px; display:inline-block; margin:2px 2px 2px 0; }
  .main { padding:32px 28px; }
  .name { font-family:'Playfair Display',Georgia,serif; font-size:34px; font-weight:900; color:${sidebar1}; letter-spacing:-1px; line-height:1; margin-bottom:5px; }
  .role { font-size:12px; font-weight:600; color:${accentDark}; text-transform:uppercase; letter-spacing:3px; margin-bottom:18px; padding-bottom:12px; border-bottom:2px solid #edf2f7; position:relative; }
  .role::after { content:''; position:absolute; bottom:-2px; left:0; width:56px; height:2px; background:${accentDark}; }
  .sec-title { font-family:'Playfair Display',Georgia,serif; font-size:16px; font-weight:700; color:${sidebar1}; margin-bottom:10px; display:flex; align-items:center; gap:10px; }
  .sec-title::before { content:''; width:20px; height:2px; background:${accentDark}; flex-shrink:0; }
  .timeline { position:relative; padding-left:8px; }
  .timeline::before { content:''; position:absolute; left:5px; top:6px; bottom:6px; width:2px; background:#e2e8f0; }
  section { margin-bottom:18px; }
  .summary { font-size:12.5px; line-height:1.75; color:#4a5568; }
  .summary strong { color:${sidebar1}; font-weight:700; }
  .proj-item { margin-bottom:10px; padding-left:14px; border-left:2px solid ${accent}33; }
  .proj-name { font-size:13px; font-weight:700; color:${sidebar1}; }
  .proj-tech { font-size:11px; color:${accentDark}; }
  .proj-desc { font-size:11.5px; color:#4a5568; margin-top:2px; line-height:1.55; }
</style>
</head><body>

<div class="sidebar">
  ${photoEl}

  <div class="sb-section">
    <div class="sb-title">Contact</div>
    ${resume.contact?.email    ? `<div class="sb-contact"><span class="ic">✉</span><span>${escHtml(resume.contact.email)}</span></div>` : ''}
    ${resume.contact?.phone    ? `<div class="sb-contact"><span class="ic">✆</span><span>${escHtml(resume.contact.phone)}</span></div>` : ''}
    ${resume.contact?.location ? `<div class="sb-contact"><span class="ic">⌂</span><span>${escHtml(resume.contact.location)}</span></div>` : ''}
    ${resume.contact?.linkedin ? `<div class="sb-contact"><span class="ic">in</span><span>${escHtml(resume.contact.linkedin)}</span></div>` : ''}
    ${resume.contact?.github   ? `<div class="sb-contact"><span class="ic">◉</span><span>${escHtml(resume.contact.github)}</span></div>` : ''}
  </div>

  ${skills.length ? `
  <div class="sb-section">
    <div class="sb-title">Skills</div>
    <div>${skills.map(s => `<span class="skill-tag">${escHtml(s)}</span>`).join('')}</div>
  </div>` : ''}

  ${softSkills.length ? `
  <div class="sb-section">
    <div class="sb-title">Strengths</div>
    <div>${softSkills.map(s => `<span class="skill-tag">${escHtml(s)}</span>`).join('')}</div>
  </div>` : ''}

  ${tools.length ? `
  <div class="sb-section">
    <div class="sb-title">Tools</div>
    <div>${tools.map(t => `<span class="tag">${escHtml(t)}</span>`).join('')}</div>
  </div>` : ''}

  ${certs.length ? `
  <div class="sb-section">
    <div class="sb-title">Certifications</div>
    <ul class="sb-list">
      ${certs.map(c => `<li><strong>${escHtml(c)}</strong></li>`).join('')}
    </ul>
  </div>` : ''}
</div>

<main class="main">
  <div class="name">${escHtml(resume.name)}</div>
  <div class="role">${escHtml(resume.summary?.split('.')[0] || '')}</div>

  ${resume.summary ? `
  <section>
    <h2 class="sec-title">Profile</h2>
    <p class="summary">${escHtml(resume.summary)}</p>
  </section>` : ''}

  ${exp.length ? `
  <section>
    <h2 class="sec-title">Experience</h2>
    <div class="timeline">
      ${exp.map(e => timelineEntry(e.title, e.company, e.duration, e.bullets)).join('')}
    </div>
  </section>` : ''}

  ${intern.length ? `
  <section>
    <h2 class="sec-title">Internships</h2>
    <div class="timeline">
      ${intern.map(i => timelineEntry(i.role, i.company, i.duration, i.bullets)).join('')}
    </div>
  </section>` : ''}

  ${projects.length ? `
  <section>
    <h2 class="sec-title">Projects</h2>
    ${projects.map(p => `
    <div class="proj-item">
      <div class="proj-name">${escHtml(p.name)}${p.tech_used ? `<span class="proj-tech"> · ${escHtml(p.tech_used)}</span>` : ''}</div>
      <div class="proj-desc">${escHtml(p.description)}</div>
    </div>`).join('')}
  </section>` : ''}

  ${edu.length ? `
  <section>
    <h2 class="sec-title">Education</h2>
    <div class="timeline">
      ${edu.map(eduEntry).join('')}
    </div>
  </section>` : ''}

  ${achieve.length ? `
  <section>
    <h2 class="sec-title">Achievements</h2>
    <ul style="list-style:none;padding:0;">
      ${achieve.map(a => `<li style="font-size:12px;color:#4a5568;padding-left:14px;position:relative;margin-bottom:4px;line-height:1.6;"><span style="position:absolute;left:0;color:${accentDark};font-weight:bold;font-size:14px;line-height:1.3;">›</span>${escHtml(a)}</li>`).join('')}
    </ul>
  </section>` : ''}
</main>

</body></html>`;
}

module.exports = { THEMES, generateHTML };
