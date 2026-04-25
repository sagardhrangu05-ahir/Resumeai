const { escHtml, skillsList } = require('../lib/resume-helpers');

const THEMES = {
  'minimal-clean':       { primary: '#1a1a1a', accent: '#555555', line: '#e0e0e0', bg: '#fafafa' },
  'minimal-clean-blue':  { primary: '#0a2540', accent: '#1565C0', line: '#BBDEFB', bg: '#F8FBFF' },
  'minimal-clean-green': { primary: '#1B2E1B', accent: '#2E7D32', line: '#C8E6C9', bg: '#F5FFF5' },
  'minimal-clean-gold':  { primary: '#2C1F00', accent: '#8B6914', line: '#F0DCA0', bg: '#FFFDF5' },
};

function generateHTML(resume, profilePhoto, theme) {
  const { primary, accent, line, bg } = theme;
  const skills  = (resume.skills?.technical || []);
  const soft    = (resume.skills?.soft || []);
  const tools   = (resume.techStack || []);
  const certs   = (resume.certifications || []).filter(Boolean);
  const exp     = (resume.experience || []).filter(e => e.title);
  const intern  = (resume.internships || []).filter(e => e.role);
  const edu     = (resume.education || []).filter(e => e.degree);
  const projects = (resume.projects || []).filter(p => p.name);
  const achieve  = (resume.achievements || []).filter(Boolean);

  const contactItems = [
    resume.contact?.location,
    resume.contact?.phone,
    resume.contact?.email,
    resume.contact?.linkedin,
    resume.contact?.github,
  ].filter(Boolean);

  function entryBlock(role, company, duration, bullets) {
    return `
    <div style="margin-bottom:13px;">
      <div style="display:flex;justify-content:space-between;align-items:baseline;flex-wrap:wrap;gap:6px;margin-bottom:3px;">
        <span style="font-size:13.5px;font-weight:700;color:${primary};">${escHtml(role)}</span>
        <span style="font-size:11.5px;font-weight:600;color:${accent};white-space:nowrap;">${escHtml(duration)}</span>
      </div>
      <div style="font-size:12.5px;font-weight:600;color:#4a5568;font-style:italic;margin-bottom:6px;">${escHtml(company)}</div>
      ${bullets?.length ? `<ul style="list-style:none;padding:0;">${bullets.map(b => `<li style="font-size:12px;line-height:1.55;color:#2d3748;padding-left:15px;position:relative;margin-bottom:4px;"><span style="position:absolute;left:0;color:${accent};font-weight:bold;">▸</span>${escHtml(b)}</li>`).join('')}</ul>` : ''}
    </div>`;
  }

  const sectionTitle = (label) => `
    <h2 style="font-family:'Merriweather',Georgia,serif;font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:2.5px;color:${primary};padding-bottom:4px;margin-bottom:10px;border-bottom:1px solid ${line};position:relative;">
      ${label}
      <span style="position:absolute;bottom:-1px;left:0;width:40px;height:2px;background:${accent};display:block;"></span>
    </h2>`;

  return `<!DOCTYPE html><html><head><meta charset="utf-8">
<style>
  @import url('https://fonts.googleapis.com/css2?family=Merriweather:wght@700;900&family=Source+Sans+3:wght@400;600;700&display=swap');
  * { margin:0; padding:0; box-sizing:border-box; }
  body { font-family:'Source Sans 3',-apple-system,sans-serif; background:${bg}; color:#1a1a1a; line-height:1.5; padding:18mm 16mm; font-size:13px; min-height:1060px; }
</style>
</head><body>

  <!-- HEADER -->
  <header style="border-bottom:3px solid ${primary};padding-bottom:14px;margin-bottom:18px;">
    <h1 style="font-family:'Merriweather',Georgia,serif;font-size:30px;font-weight:900;color:${primary};letter-spacing:-0.5px;line-height:1.1;margin-bottom:4px;">${escHtml(resume.name)}</h1>
    ${resume.summary ? `<div style="font-size:13px;font-weight:600;color:${accent};text-transform:uppercase;letter-spacing:2px;margin-bottom:10px;">${escHtml(resume.summary.split('.')[0])}</div>` : ''}
    <div style="display:flex;flex-wrap:wrap;gap:12px;font-size:12px;color:#444;">
      ${contactItems.map(c => `<span><span style="color:${accent};font-weight:bold;">● </span>${escHtml(c)}</span>`).join('')}
    </div>
  </header>

  ${resume.summary ? `
  <section style="margin-bottom:16px;">
    ${sectionTitle('Professional Summary')}
    <p style="font-size:12.5px;line-height:1.65;color:#2d3748;">${escHtml(resume.summary)}</p>
  </section>` : ''}

  ${exp.length ? `
  <section style="margin-bottom:16px;">
    ${sectionTitle('Work Experience')}
    ${exp.map(e => entryBlock(e.title, e.company, e.duration, e.bullets)).join('')}
  </section>` : ''}

  ${intern.length ? `
  <section style="margin-bottom:16px;">
    ${sectionTitle('Internships')}
    ${intern.map(i => entryBlock(i.role, i.company, i.duration, i.bullets)).join('')}
  </section>` : ''}

  ${projects.length ? `
  <section style="margin-bottom:16px;">
    ${sectionTitle('Projects')}
    ${projects.map(p => `
    <div style="margin-bottom:10px;">
      <div style="font-size:13px;font-weight:700;color:${primary};">${escHtml(p.name)}${p.tech_used ? `<span style="font-size:11px;font-weight:400;color:${accent};"> · ${escHtml(p.tech_used)}</span>` : ''}</div>
      <div style="font-size:12px;color:#4a5568;margin-top:2px;line-height:1.55;">${escHtml(p.description)}</div>
    </div>`).join('')}
  </section>` : ''}

  ${(skills.length || soft.length || tools.length) ? `
  <section style="margin-bottom:16px;">
    ${sectionTitle('Technical Skills')}
    <div style="display:grid;grid-template-columns:130px 1fr;gap:5px 14px;font-size:12px;">
      ${skills.length   ? `<div style="font-weight:700;color:${primary};">Skills</div><div style="color:#2d3748;">${skills.map(s => escHtml(s)).join(' · ')}</div>` : ''}
      ${tools.length    ? `<div style="font-weight:700;color:${primary};">Tools</div><div style="color:#2d3748;">${tools.map(t => escHtml(t)).join(' · ')}</div>` : ''}
      ${soft.length     ? `<div style="font-weight:700;color:${primary};">Strengths</div><div style="color:#2d3748;">${soft.map(s => escHtml(s)).join(' · ')}</div>` : ''}
    </div>
  </section>` : ''}

  <div style="display:grid;grid-template-columns:1fr 1fr;gap:24px;margin-bottom:16px;">
    ${edu.length ? `
    <section>
      ${sectionTitle('Education')}
      ${edu.map(e => `
      <div style="margin-bottom:10px;">
        <div style="display:flex;justify-content:space-between;align-items:baseline;flex-wrap:wrap;gap:6px;margin-bottom:2px;">
          <span style="font-size:13px;font-weight:700;color:${primary};">${escHtml(e.degree)}</span>
          <span style="font-size:11.5px;font-weight:600;color:${accent};">${escHtml(e.year)}</span>
        </div>
        <div style="font-size:12px;font-weight:600;color:#4a5568;font-style:italic;margin-bottom:3px;">${escHtml(e.institution)}</div>
        ${e.score ? `<div style="font-size:11.5px;color:#718096;">${escHtml(e.score)}</div>` : ''}
      </div>`).join('')}
    </section>` : '<div></div>'}

    ${certs.length ? `
    <section>
      ${sectionTitle('Certifications')}
      <ul style="list-style:none;padding:0;">
        ${certs.map(c => `<li style="font-size:12px;line-height:1.55;color:#2d3748;padding-left:15px;position:relative;margin-bottom:4px;"><span style="position:absolute;left:0;color:${accent};font-weight:bold;">▸</span>${escHtml(c)}</li>`).join('')}
      </ul>
    </section>` : '<div></div>'}
  </div>

  ${achieve.length ? `
  <section style="margin-bottom:16px;">
    ${sectionTitle('Key Achievements')}
    <ul style="list-style:none;padding:0;">
      ${achieve.map(a => `<li style="font-size:12px;line-height:1.55;color:#2d3748;padding-left:15px;position:relative;margin-bottom:4px;"><span style="position:absolute;left:0;color:${accent};font-weight:bold;">▸</span>${escHtml(a)}</li>`).join('')}
    </ul>
  </section>` : ''}

</body></html>`;
}

module.exports = { THEMES, generateHTML };
