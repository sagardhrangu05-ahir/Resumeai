const puppeteer = require('puppeteer');

// ─── Shared helpers ────────────────────────────────────────────────────────────

function escHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function contactLine(resume) {
  return [
    resume.contact?.email,
    resume.contact?.phone,
    resume.contact?.location,
    resume.contact?.linkedin,
    resume.contact?.github
  ].filter(Boolean).map(escHtml).join(' • ');
}

function skillsList(resume) {
  return [
    ...(resume.skills?.technical || []),
    ...(resume.techStack         || []),
    ...(resume.skills?.soft      || [])
  ];
}

function experienceSection(resume) {
  const items = resume.experience?.filter(e => e.title) || [];
  return items.map(exp => `
    <div class="exp-item">
      <div class="exp-header">
        <span class="exp-title">${escHtml(exp.title)}</span>
        <span class="exp-duration">${escHtml(exp.duration)}</span>
      </div>
      <div class="exp-company">${escHtml(exp.company)}</div>
      ${exp.bullets?.length ? `<ul>${exp.bullets.map(b => `<li>${escHtml(b)}</li>`).join('')}</ul>` : ''}
    </div>`).join('');
}

function internshipSection(resume) {
  const items = resume.internships?.filter(e => e.role) || [];
  if (!items.length) return '';
  return items.map(i => `
    <div class="exp-item">
      <div class="exp-header">
        <span class="exp-title">${escHtml(i.role)}</span>
        <span class="exp-duration">${escHtml(i.duration)}</span>
      </div>
      <div class="exp-company">${escHtml(i.company)}</div>
      ${i.bullets?.length ? `<ul>${i.bullets.map(b => `<li>${escHtml(b)}</li>`).join('')}</ul>` : ''}
    </div>`).join('');
}

function educationSection(resume) {
  return (resume.education?.filter(e => e.degree) || []).map(edu => `
    <div class="edu-item">
      <div class="exp-header">
        <span class="edu-degree">${escHtml(edu.degree)}</span>
        <span class="exp-duration">${escHtml(edu.year)}</span>
      </div>
      <div class="edu-school">${escHtml(edu.institution)}${edu.score ? ` • ${escHtml(edu.score)}` : ''}</div>
    </div>`).join('');
}

function projectsSection(resume) {
  return (resume.projects?.filter(p => p.name) || []).map(p => `
    <div style="margin-bottom: 8px;">
      <span class="proj-name">${escHtml(p.name)}</span>
      ${p.tech_used ? `<span class="proj-tech"> (${escHtml(p.tech_used)})</span>` : ''}
      <p class="proj-desc">${escHtml(p.description)}</p>
    </div>`).join('');
}

function achievementsSection(resume) {
  const items = resume.achievements?.filter(Boolean) || [];
  if (!items.length) return '';
  return `<ul>${items.map(a => `<li>${escHtml(a)}</li>`).join('')}</ul>`;
}

function certificationsSection(resume) {
  const items = resume.certifications?.filter(Boolean) || [];
  if (!items.length) return '';
  return `<ul class="cert-list">${items.map(c => `<li>${escHtml(c)}</li>`).join('')}</ul>`;
}

// ─── DESIGN 1: Classic Pro ─────────────────────────────────────────────────────

function classicProHTML(resume, profilePhoto) {
  const skills = skillsList(resume);
  const photo  = profilePhoto
    ? `<img src="${profilePhoto}" alt="Profile" style="width:80px;height:80px;border-radius:50%;object-fit:cover;border:2px solid #1a1a1a;flex-shrink:0;" />`
    : '';

  return `<!DOCTYPE html><html><head><meta charset="utf-8">
<style>
  @import url('https://fonts.googleapis.com/css2?family=EB+Garamond:wght@400;600;700&display=swap');
  * { margin:0; padding:0; box-sizing:border-box; }
  body { font-family: Georgia, 'EB Garamond', serif; color:#1a1a1a; line-height:1.5; padding:36px 48px; font-size:11px; }
  .header-row { display:flex; justify-content:space-between; align-items:flex-start; gap:16px; margin-bottom:2px; }
  h1 { font-size:22px; font-weight:700; color:#111; letter-spacing:-0.5px; }
  .contact { font-size:10px; color:#555; margin-bottom:14px; padding-bottom:10px; border-bottom:2px solid #1a1a1a; }
  .section { margin-bottom:14px; }
  .section-title { font-size:11px; font-weight:700; color:#1a1a1a; text-transform:uppercase; letter-spacing:1.5px; border-bottom:1px solid #1a1a1a; padding-bottom:3px; margin-bottom:8px; }
  .summary { font-size:11px; color:#333; line-height:1.6; }
  .exp-item { margin-bottom:10px; }
  .exp-header { display:flex; justify-content:space-between; align-items:baseline; }
  .exp-title { font-size:12px; font-weight:700; color:#111; }
  .exp-duration { font-size:10px; color:#777; font-style:italic; }
  .exp-company { font-size:11px; color:#444; margin-bottom:3px; }
  ul { padding-left:18px; }
  li { font-size:11px; color:#333; margin-bottom:2px; line-height:1.5; }
  .edu-item { margin-bottom:6px; }
  .edu-degree { font-size:12px; font-weight:700; }
  .edu-school { font-size:11px; color:#444; }
  .skills-list { display:flex; flex-wrap:wrap; gap:4px; list-style:none; padding:0; }
  .skills-list li { background:#f5f5f5; padding:2px 8px; border-radius:2px; font-size:10px; font-family:Georgia,serif; }
  .proj-name { font-size:11px; font-weight:700; }
  .proj-tech { font-size:10px; color:#777; }
  .proj-desc { font-size:11px; color:#333; margin-top:1px; }
  .cert-list { padding-left:18px; }
  .cert-list li { font-size:11px; }
</style></head><body>
  <div class="header-row">
    <div style="flex:1">
      <h1>${escHtml(resume.name)}</h1>
      <div class="contact">${contactLine(resume)}</div>
    </div>
    ${photo}
  </div>
  ${resume.summary ? `<div class="section"><div class="section-title">Professional Summary</div><p class="summary">${escHtml(resume.summary)}</p></div>` : ''}
  ${resume.experience?.filter(e=>e.title).length ? `<div class="section"><div class="section-title">Work Experience</div>${experienceSection(resume)}</div>` : ''}
  ${resume.internships?.filter(e=>e.role).length ? `<div class="section"><div class="section-title">Internships</div>${internshipSection(resume)}</div>` : ''}
  ${resume.education?.filter(e=>e.degree).length ? `<div class="section"><div class="section-title">Education</div>${educationSection(resume)}</div>` : ''}
  ${skills.length ? `<div class="section"><div class="section-title">Skills</div><ul class="skills-list">${skills.map(s=>`<li>${escHtml(s)}</li>`).join('')}</ul></div>` : ''}
  ${resume.projects?.filter(p=>p.name).length ? `<div class="section"><div class="section-title">Projects</div>${projectsSection(resume)}</div>` : ''}
  ${resume.achievements?.filter(Boolean).length ? `<div class="section"><div class="section-title">Key Achievements</div>${achievementsSection(resume)}</div>` : ''}
  ${resume.certifications?.filter(Boolean).length ? `<div class="section"><div class="section-title">Certifications</div>${certificationsSection(resume)}</div>` : ''}
</body></html>`;
}

// ─── DESIGN 2: Modern Split ────────────────────────────────────────────────────

function modernSplitHTML(resume, profilePhoto) {
  const skills = skillsList(resume);
  const photo  = profilePhoto
    ? `<img src="${profilePhoto}" alt="Profile" style="width:70px;height:70px;border-radius:50%;object-fit:cover;border:3px solid #2196F3;margin-bottom:12px;" />`
    : '';

  return `<!DOCTYPE html><html><head><meta charset="utf-8">
<style>
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
  * { margin:0; padding:0; box-sizing:border-box; }
  body { font-family: Inter, Arial, sans-serif; color:#333; line-height:1.5; font-size:11px; display:flex; min-height:100vh; }
  .sidebar { width:220px; background:#1e3a5f; color:#fff; padding:28px 20px; flex-shrink:0; }
  .main { flex:1; padding:28px 28px; background:#f8f9fa; }
  .sidebar-name { font-size:16px; font-weight:700; color:#fff; margin-bottom:4px; line-height:1.2; }
  .sidebar-role { font-size:10px; color:#90CAF9; margin-bottom:16px; }
  .sidebar-section { margin-bottom:18px; }
  .sidebar-title { font-size:9px; font-weight:700; text-transform:uppercase; letter-spacing:1.5px; color:#90CAF9; border-bottom:1px solid rgba(255,255,255,0.15); padding-bottom:4px; margin-bottom:8px; }
  .sidebar-text { font-size:10px; color:#CBD5E1; line-height:1.7; }
  .skill-badge { display:inline-block; background:rgba(33,150,243,0.25); color:#90CAF9; border-radius:3px; padding:2px 8px; font-size:9px; margin:2px 2px 2px 0; }
  .main h1 { font-size:20px; font-weight:700; color:#1e3a5f; margin-bottom:2px; }
  .main-contact { font-size:10px; color:#2196F3; margin-bottom:16px; border-bottom:2px solid #2196F3; padding-bottom:8px; }
  .section { margin-bottom:14px; }
  .section-title { font-size:11px; font-weight:700; color:#1e3a5f; text-transform:uppercase; letter-spacing:1px; margin-bottom:6px; display:flex; align-items:center; gap:6px; }
  .section-title::after { content:''; flex:1; height:1px; background:#2196F3; opacity:0.4; }
  .summary { font-size:11px; color:#444; line-height:1.6; }
  .exp-item { margin-bottom:10px; }
  .exp-header { display:flex; justify-content:space-between; align-items:baseline; }
  .exp-title { font-size:12px; font-weight:600; color:#1e3a5f; }
  .exp-duration { font-size:10px; color:#2196F3; background:rgba(33,150,243,0.1); padding:1px 7px; border-radius:10px; }
  .exp-company { font-size:11px; color:#666; margin-bottom:3px; }
  ul { padding-left:16px; }
  li { font-size:11px; color:#444; margin-bottom:2px; line-height:1.5; }
  .edu-item { margin-bottom:6px; }
  .edu-degree { font-size:12px; font-weight:600; color:#1e3a5f; }
  .edu-school { font-size:11px; color:#666; }
  .proj-name { font-size:11px; font-weight:600; color:#1e3a5f; }
  .proj-tech { font-size:10px; color:#2196F3; }
  .proj-desc { font-size:11px; color:#444; margin-top:1px; }
  .cert-list { padding-left:16px; }
  .cert-list li { font-size:11px; }
  .exp-duration-plain { font-size:10px; color:#777; font-style:italic; }
</style></head><body>
  <!-- Sidebar -->
  <div class="sidebar">
    ${photo}
    <div class="sidebar-name">${escHtml(resume.name)}</div>
    <div class="sidebar-role">${escHtml(resume.summary?.split('.')[0] || '')}</div>
    <div class="sidebar-section">
      <div class="sidebar-title">Contact</div>
      <div class="sidebar-text">
        ${[resume.contact?.email, resume.contact?.phone, resume.contact?.location, resume.contact?.linkedin, resume.contact?.github].filter(Boolean).map(c => `<div>${escHtml(c)}</div>`).join('')}
      </div>
    </div>
    ${skills.length ? `
    <div class="sidebar-section">
      <div class="sidebar-title">Skills</div>
      <div>${skills.map(s=>`<span class="skill-badge">${escHtml(s)}</span>`).join('')}</div>
    </div>` : ''}
    ${resume.certifications?.filter(Boolean).length ? `
    <div class="sidebar-section">
      <div class="sidebar-title">Certifications</div>
      <div class="sidebar-text">${resume.certifications.filter(Boolean).map(c=>`<div>• ${escHtml(c)}</div>`).join('')}</div>
    </div>` : ''}
  </div>
  <!-- Main -->
  <div class="main">
    <h1>${escHtml(resume.name)}</h1>
    <div class="main-contact">${contactLine(resume)}</div>
    ${resume.summary ? `<div class="section"><div class="section-title">Summary</div><p class="summary">${escHtml(resume.summary)}</p></div>` : ''}
    ${resume.experience?.filter(e=>e.title).length ? `<div class="section"><div class="section-title">Experience</div>${experienceSection(resume)}</div>` : ''}
    ${resume.internships?.filter(e=>e.role).length ? `<div class="section"><div class="section-title">Internships</div>${internshipSection(resume)}</div>` : ''}
    ${resume.projects?.filter(p=>p.name).length ? `<div class="section"><div class="section-title">Projects</div>${projectsSection(resume)}</div>` : ''}
    ${resume.education?.filter(e=>e.degree).length ? `<div class="section"><div class="section-title">Education</div>${educationSection(resume)}</div>` : ''}
    ${resume.achievements?.filter(Boolean).length ? `<div class="section"><div class="section-title">Achievements</div>${achievementsSection(resume)}</div>` : ''}
  </div>
</body></html>`;
}

// ─── DESIGN 3: Creative Edge ───────────────────────────────────────────────────

function creativeEdgeHTML(resume, profilePhoto) {
  const skills = skillsList(resume);
  const photo  = profilePhoto
    ? `<img src="${profilePhoto}" alt="Profile" style="width:72px;height:72px;border-radius:50%;object-fit:cover;border:3px solid rgba(255,255,255,0.4);flex-shrink:0;" />`
    : '';

  return `<!DOCTYPE html><html><head><meta charset="utf-8">
<style>
  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap');
  * { margin:0; padding:0; box-sizing:border-box; }
  body { font-family: Poppins, Arial, sans-serif; color:#1a1a1a; line-height:1.5; font-size:11px; background:#fff; }
  .header { background:linear-gradient(135deg, #1a237e 0%, #7c4dff 100%); color:#fff; padding:28px 40px; }
  .header-top { display:flex; justify-content:space-between; align-items:center; }
  .header-left h1 { font-size:24px; font-weight:800; color:#fff; letter-spacing:-0.5px; }
  .header-left .subtitle { font-size:12px; color:rgba(255,255,255,0.75); margin-top:2px; }
  .header-contact { margin-top:12px; display:flex; gap:16px; flex-wrap:wrap; }
  .header-contact span { font-size:10px; color:rgba(255,255,255,0.8); background:rgba(255,255,255,0.1); padding:3px 10px; border-radius:20px; }
  .body { padding:24px 40px; }
  .section { margin-bottom:16px; }
  .section-title { font-size:11px; font-weight:700; color:#7c4dff; text-transform:uppercase; letter-spacing:1.5px; margin-bottom:8px; display:flex; align-items:center; gap:8px; }
  .section-title::before { content:''; width:4px; height:16px; background:#7c4dff; border-radius:2px; }
  .summary { font-size:11px; color:#333; line-height:1.7; }
  .exp-item { margin-bottom:12px; padding-left:12px; border-left:2px solid #ede7f6; }
  .exp-header { display:flex; justify-content:space-between; align-items:baseline; }
  .exp-title { font-size:12px; font-weight:600; color:#1a237e; }
  .exp-duration { font-size:10px; color:#7c4dff; font-weight:500; }
  .exp-company { font-size:11px; color:#666; margin-bottom:3px; }
  ul { padding-left:16px; }
  li { font-size:11px; color:#444; margin-bottom:2px; line-height:1.5; }
  .edu-item { margin-bottom:8px; }
  .edu-degree { font-size:12px; font-weight:600; color:#1a237e; }
  .edu-school { font-size:11px; color:#666; }
  .skill-badge { display:inline-block; background:#ede7f6; color:#7c4dff; padding:3px 10px; border-radius:20px; font-size:10px; font-weight:500; margin:2px 2px 2px 0; }
  .proj-name { font-size:12px; font-weight:600; color:#1a237e; }
  .proj-tech { font-size:10px; color:#7c4dff; }
  .proj-desc { font-size:11px; color:#444; margin-top:2px; }
  .cert-list { padding-left:16px; }
  .cert-list li { font-size:11px; }
  .achievements ul { padding-left:16px; }
  .exp-duration-plain { font-size:10px; color:#777; }
</style></head><body>
  <div class="header">
    <div class="header-top">
      <div class="header-left">
        <h1>${escHtml(resume.name)}</h1>
        <div class="subtitle">${escHtml(resume.summary?.split('.')[0] || '')}</div>
      </div>
      ${photo}
    </div>
    <div class="header-contact">
      ${[resume.contact?.email, resume.contact?.phone, resume.contact?.location, resume.contact?.linkedin, resume.contact?.github].filter(Boolean).map(c=>`<span>${escHtml(c)}</span>`).join('')}
    </div>
  </div>
  <div class="body">
    ${resume.summary ? `<div class="section"><div class="section-title">About Me</div><p class="summary">${escHtml(resume.summary)}</p></div>` : ''}
    ${resume.experience?.filter(e=>e.title).length ? `<div class="section"><div class="section-title">Experience</div>${experienceSection(resume)}</div>` : ''}
    ${resume.internships?.filter(e=>e.role).length ? `<div class="section"><div class="section-title">Internships</div>${internshipSection(resume)}</div>` : ''}
    ${skills.length ? `<div class="section"><div class="section-title">Skills & Technologies</div><div>${skills.map(s=>`<span class="skill-badge">${escHtml(s)}</span>`).join('')}</div></div>` : ''}
    ${resume.projects?.filter(p=>p.name).length ? `<div class="section"><div class="section-title">Projects</div>${projectsSection(resume)}</div>` : ''}
    ${resume.education?.filter(e=>e.degree).length ? `<div class="section"><div class="section-title">Education</div>${educationSection(resume)}</div>` : ''}
    ${resume.achievements?.filter(Boolean).length ? `<div class="section achievements"><div class="section-title">Key Achievements</div>${achievementsSection(resume)}</div>` : ''}
    ${resume.certifications?.filter(Boolean).length ? `<div class="section"><div class="section-title">Certifications</div>${certificationsSection(resume)}</div>` : ''}
  </div>
</body></html>`;
}

// ─── DESIGN 4: Minimal Clean ───────────────────────────────────────────────────

function minimalCleanHTML(resume, profilePhoto) {
  const skills = skillsList(resume);
  const photo  = profilePhoto
    ? `<img src="${profilePhoto}" alt="Profile" style="width:68px;height:68px;border-radius:4px;object-fit:cover;flex-shrink:0;" />`
    : '';

  return `<!DOCTYPE html><html><head><meta charset="utf-8">
<style>
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&display=swap');
  * { margin:0; padding:0; box-sizing:border-box; }
  body { font-family: 'DM Sans', Arial, sans-serif; color:#212121; line-height:1.6; padding:40px 52px; font-size:11px; background:#fafafa; }
  .header-row { display:flex; justify-content:space-between; align-items:flex-start; gap:20px; margin-bottom:4px; }
  h1 { font-size:22px; font-weight:700; color:#212121; letter-spacing:-0.5px; }
  .contact { font-size:10px; color:#757575; margin-top:4px; margin-bottom:14px; }
  hr { border:none; border-top:1px solid #e0e0e0; margin:0 0 14px; }
  .section { margin-bottom:14px; }
  .section-title { font-size:10px; font-weight:700; color:#212121; text-transform:uppercase; letter-spacing:2px; margin-bottom:8px; }
  .summary { font-size:11px; color:#424242; line-height:1.7; }
  .exp-item { margin-bottom:10px; }
  .exp-header { display:flex; justify-content:space-between; align-items:baseline; }
  .exp-title { font-size:12px; font-weight:600; color:#212121; }
  .exp-duration { font-size:10px; color:#9e9e9e; }
  .exp-company { font-size:11px; color:#757575; margin-bottom:3px; }
  ul { padding-left:16px; }
  li { font-size:11px; color:#424242; margin-bottom:2px; line-height:1.5; }
  .edu-item { margin-bottom:6px; }
  .edu-degree { font-size:12px; font-weight:600; color:#212121; }
  .edu-school { font-size:11px; color:#757575; }
  .skills-inline { font-size:11px; color:#424242; }
  .proj-name { font-size:11px; font-weight:600; color:#212121; }
  .proj-tech { font-size:10px; color:#9e9e9e; }
  .proj-desc { font-size:11px; color:#424242; margin-top:1px; }
  .cert-list { padding-left:16px; }
  .cert-list li { font-size:11px; }
</style></head><body>
  <div class="header-row">
    <div style="flex:1">
      <h1>${escHtml(resume.name)}</h1>
      <div class="contact">${contactLine(resume)}</div>
    </div>
    ${photo}
  </div>
  <hr/>
  ${resume.summary ? `<div class="section"><div class="section-title">Summary</div><p class="summary">${escHtml(resume.summary)}</p></div><hr/>` : ''}
  ${resume.experience?.filter(e=>e.title).length ? `<div class="section"><div class="section-title">Experience</div>${experienceSection(resume)}</div><hr/>` : ''}
  ${resume.internships?.filter(e=>e.role).length ? `<div class="section"><div class="section-title">Internships</div>${internshipSection(resume)}</div><hr/>` : ''}
  ${resume.education?.filter(e=>e.degree).length ? `<div class="section"><div class="section-title">Education</div>${educationSection(resume)}</div><hr/>` : ''}
  ${skills.length ? `<div class="section"><div class="section-title">Skills</div><p class="skills-inline">${skills.map(s=>escHtml(s)).join(' · ')}</p></div><hr/>` : ''}
  ${resume.projects?.filter(p=>p.name).length ? `<div class="section"><div class="section-title">Projects</div>${projectsSection(resume)}</div><hr/>` : ''}
  ${resume.achievements?.filter(Boolean).length ? `<div class="section"><div class="section-title">Achievements</div>${achievementsSection(resume)}</div><hr/>` : ''}
  ${resume.certifications?.filter(Boolean).length ? `<div class="section"><div class="section-title">Certifications</div>${certificationsSection(resume)}</div>` : ''}
</body></html>`;
}

// ─── Router ────────────────────────────────────────────────────────────────────

function resumeToHTML(resume, profilePhoto, design = 'classic-pro') {
  switch (design) {
    case 'modern-split':    return modernSplitHTML(resume, profilePhoto);
    case 'creative-edge':   return creativeEdgeHTML(resume, profilePhoto);
    case 'minimal-clean':   return minimalCleanHTML(resume, profilePhoto);
    case 'classic-pro':
    default:                return classicProHTML(resume, profilePhoto);
  }
}

async function generatePDF(resume, profilePhoto, design = 'classic-pro') {
  const html = resumeToHTML(resume, profilePhoto || null, design);

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: 'networkidle0' });

  const pdfBuffer = await page.pdf({
    format: 'A4',
    printBackground: true,
    margin: { top: '0px', bottom: '0px', left: '0px', right: '0px' }
  });

  await browser.close();
  return pdfBuffer;
}

module.exports = { generatePDF };
