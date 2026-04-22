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


// ─── Color themes for variants ─────────────────────────────────────────────────

const CLASSIC_PRO_THEMES = {
  'classic-pro':        { primary: '#1a1a1a', accent: '#444',    bg: '#ffffff' },
  'classic-pro-navy':   { primary: '#1a3a5f', accent: '#2a5f8f', bg: '#ffffff' },
  'classic-pro-green':  { primary: '#1a4a1a', accent: '#2d7a2d', bg: '#ffffff' },
  'classic-pro-maroon': { primary: '#5a1a1a', accent: '#8b2020', bg: '#ffffff' },
};

const MODERN_SPLIT_THEMES = {
  'modern-split':        { sidebar: '#1e3a5f', accent: '#2196F3', bg: '#f8f9fa' },
  'modern-split-purple': { sidebar: '#2d1b5e', accent: '#7c4dff', bg: '#f5f0ff' },
  'modern-split-teal':   { sidebar: '#1a4a4a', accent: '#00BCD4', bg: '#f0fafa' },
  'modern-split-orange': { sidebar: '#3a2000', accent: '#FF8C00', bg: '#fff8f0' },
};

const CREATIVE_EDGE_THEMES = {
  'creative-edge':       { grad1: '#1a237e', grad2: '#7c4dff', accent: '#7c4dff', badge: '#ede7f6', badgeText: '#7c4dff' },
  'creative-edge-rose':  { grad1: '#7b0d1e', grad2: '#e84393', accent: '#e84393', badge: '#fce4ec', badgeText: '#e84393' },
  'creative-edge-teal':  { grad1: '#004d40', grad2: '#00bcd4', accent: '#00bcd4', badge: '#e0f7fa', badgeText: '#00838f' },
  'creative-edge-dark':  { grad1: '#0d0d1a', grad2: '#1a237e', accent: '#4fc3f7', badge: '#1a1a3e', badgeText: '#4fc3f7' },
};

const MINIMAL_CLEAN_THEMES = {
  'minimal-clean':       { accent: '#757575', line: '#e0e0e0', bg: '#fafafa', text: '#212121' },
  'minimal-clean-blue':  { accent: '#1565C0', line: '#BBDEFB', bg: '#F8FBFF', text: '#0D1B2A' },
  'minimal-clean-green': { accent: '#2E7D32', line: '#C8E6C9', bg: '#F5FFF5', text: '#1B2E1B' },
  'minimal-clean-gold':  { accent: '#8B6914', line: '#F0DCA0', bg: '#FFFDF5', text: '#2C1F00' },
};

// ─── Themed HTML builders ──────────────────────────────────────────────────────

function classicProThemedHTML(resume, profilePhoto, theme) {
  const { primary, accent, bg } = theme;
  const skills = skillsList(resume);
  const photo  = profilePhoto
    ? `<img src="${profilePhoto}" alt="Profile" style="width:80px;height:80px;border-radius:50%;object-fit:cover;border:2px solid ${primary};flex-shrink:0;" />`
    : '';
  return `<!DOCTYPE html><html><head><meta charset="utf-8">
<style>
  @import url('https://fonts.googleapis.com/css2?family=EB+Garamond:wght@400;600;700&display=swap');
  * { margin:0; padding:0; box-sizing:border-box; }
  body { font-family: Georgia, 'EB Garamond', serif; color:${primary}; line-height:1.6; padding:36px 48px; font-size:13px; background:${bg}; min-height:1060px; }
  .header-row { display:flex; justify-content:space-between; align-items:flex-start; gap:16px; margin-bottom:4px; }
  h1 { font-size:26px; font-weight:700; color:${primary}; letter-spacing:-0.5px; }
  .contact { font-size:12px; color:${accent}; margin-bottom:16px; padding-bottom:10px; border-bottom:2px solid ${primary}; }
  .section { margin-bottom:16px; }
  .section-title { font-size:12px; font-weight:700; color:${primary}; text-transform:uppercase; letter-spacing:1.5px; border-bottom:1px solid ${primary}; padding-bottom:3px; margin-bottom:10px; }
  .summary { font-size:13px; color:${accent}; line-height:1.7; }
  .exp-item { margin-bottom:12px; }
  .exp-header { display:flex; justify-content:space-between; align-items:baseline; }
  .exp-title { font-size:14px; font-weight:700; color:${primary}; }
  .exp-duration { font-size:12px; color:${accent}; font-style:italic; }
  .exp-company { font-size:13px; color:${accent}; margin-bottom:4px; }
  ul { padding-left:18px; }
  li { font-size:13px; color:${accent}; margin-bottom:3px; line-height:1.6; }
  .edu-item { margin-bottom:8px; }
  .edu-degree { font-size:14px; font-weight:700; }
  .edu-school { font-size:13px; color:${accent}; }
  .skills-list { display:flex; flex-wrap:wrap; gap:5px; list-style:none; padding:0; }
  .skills-list li { background:${bg === '#ffffff' ? '#f5f5f5' : bg}; padding:3px 10px; border-radius:2px; font-size:12px; border:1px solid ${primary}33; }
  .proj-name { font-size:13px; font-weight:700; }
  .proj-tech { font-size:12px; color:${accent}; }
  .proj-desc { font-size:13px; color:${accent}; margin-top:2px; }
  .cert-list { padding-left:18px; }
  .cert-list li { font-size:13px; }
</style></head><body>
  <div class="header-row">
    <div style="flex:1"><h1>${escHtml(resume.name)}</h1><div class="contact">${contactLine(resume)}</div></div>
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

function modernSplitThemedHTML(resume, profilePhoto, theme) {
  const { sidebar, accent, bg } = theme;
  const skills = skillsList(resume);
  const photo  = profilePhoto
    ? `<img src="${profilePhoto}" alt="Profile" style="width:70px;height:70px;border-radius:50%;object-fit:cover;border:3px solid ${accent};margin-bottom:12px;" />`
    : '';
  return `<!DOCTYPE html><html><head><meta charset="utf-8">
<style>
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
  * { margin:0; padding:0; box-sizing:border-box; }
  body { font-family: Inter, Arial, sans-serif; color:#333; line-height:1.6; font-size:13px; display:flex; min-height:1123px; }
  .sidebar { width:240px; background:${sidebar}; color:#fff; padding:30px 22px; flex-shrink:0; min-height:1123px; }
  .main { flex:1; padding:30px 30px; background:${bg}; }
  .sidebar-name { font-size:18px; font-weight:700; color:#fff; margin-bottom:4px; line-height:1.2; }
  .sidebar-role { font-size:12px; color:${accent}; margin-bottom:18px; }
  .sidebar-section { margin-bottom:20px; }
  .sidebar-title { font-size:10px; font-weight:700; text-transform:uppercase; letter-spacing:1.5px; color:${accent}; border-bottom:1px solid rgba(255,255,255,0.15); padding-bottom:4px; margin-bottom:10px; }
  .sidebar-text { font-size:12px; color:rgba(255,255,255,0.8); line-height:1.8; }
  .skill-badge { display:inline-block; background:${accent}44; color:#fff; border-radius:3px; padding:3px 9px; font-size:11px; margin:2px 2px 2px 0; }
  .main h1 { font-size:24px; font-weight:700; color:${sidebar}; margin-bottom:2px; }
  .main-contact { font-size:12px; color:${accent}; margin-bottom:16px; border-bottom:2px solid ${accent}; padding-bottom:8px; }
  .section { margin-bottom:16px; }
  .section-title { font-size:12px; font-weight:700; color:${sidebar}; text-transform:uppercase; letter-spacing:1px; margin-bottom:8px; display:flex; align-items:center; gap:6px; }
  .section-title::after { content:''; flex:1; height:1px; background:${accent}; opacity:0.4; }
  .summary { font-size:13px; color:#444; line-height:1.7; }
  .exp-item { margin-bottom:12px; }
  .exp-header { display:flex; justify-content:space-between; align-items:baseline; }
  .exp-title { font-size:14px; font-weight:600; color:${sidebar}; }
  .exp-duration { font-size:12px; color:${accent}; background:${accent}1a; padding:1px 8px; border-radius:10px; }
  .exp-company { font-size:13px; color:#666; margin-bottom:4px; }
  ul { padding-left:16px; }
  li { font-size:13px; color:#444; margin-bottom:3px; line-height:1.6; }
  .edu-item { margin-bottom:8px; }
  .edu-degree { font-size:14px; font-weight:600; color:${sidebar}; }
  .edu-school { font-size:13px; color:#666; }
  .proj-name { font-size:13px; font-weight:600; color:${sidebar}; }
  .proj-tech { font-size:12px; color:${accent}; }
  .proj-desc { font-size:13px; color:#444; margin-top:2px; }
  .cert-list { padding-left:16px; }
  .cert-list li { font-size:13px; }
</style></head><body>
  <div class="sidebar">
    ${photo}
    <div class="sidebar-name">${escHtml(resume.name)}</div>
    <div class="sidebar-role">${escHtml(resume.summary?.split('.')[0] || '')}</div>
    <div class="sidebar-section">
      <div class="sidebar-title">Contact</div>
      <div class="sidebar-text">${[resume.contact?.email, resume.contact?.phone, resume.contact?.location, resume.contact?.linkedin, resume.contact?.github].filter(Boolean).map(c=>`<div>${escHtml(c)}</div>`).join('')}</div>
    </div>
    ${skills.length ? `<div class="sidebar-section"><div class="sidebar-title">Skills</div><div>${skills.map(s=>`<span class="skill-badge">${escHtml(s)}</span>`).join('')}</div></div>` : ''}
    ${resume.certifications?.filter(Boolean).length ? `<div class="sidebar-section"><div class="sidebar-title">Certifications</div><div class="sidebar-text">${resume.certifications.filter(Boolean).map(c=>`<div>• ${escHtml(c)}</div>`).join('')}</div></div>` : ''}
  </div>
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

function creativeEdgeThemedHTML(resume, profilePhoto, theme) {
  const { grad1, grad2, accent, badge, badgeText } = theme;
  const skills = skillsList(resume);
  const photo  = profilePhoto
    ? `<img src="${profilePhoto}" alt="Profile" style="width:72px;height:72px;border-radius:50%;object-fit:cover;border:3px solid rgba(255,255,255,0.4);flex-shrink:0;" />`
    : '';
  return `<!DOCTYPE html><html><head><meta charset="utf-8">
<style>
  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap');
  * { margin:0; padding:0; box-sizing:border-box; }
  body { font-family: Poppins, Arial, sans-serif; color:#1a1a1a; line-height:1.6; font-size:13px; background:#fff; min-height:1123px; }
  .header { background:linear-gradient(135deg, ${grad1} 0%, ${grad2} 100%); color:#fff; padding:30px 40px; }
  .header-top { display:flex; justify-content:space-between; align-items:center; }
  .header-left h1 { font-size:28px; font-weight:800; color:#fff; letter-spacing:-0.5px; }
  .header-left .subtitle { font-size:13px; color:rgba(255,255,255,0.75); margin-top:3px; }
  .header-contact { margin-top:14px; display:flex; gap:16px; flex-wrap:wrap; }
  .header-contact span { font-size:12px; color:rgba(255,255,255,0.9); background:rgba(255,255,255,0.12); padding:4px 12px; border-radius:20px; }
  .body { padding:26px 40px; }
  .section { margin-bottom:18px; }
  .section-title { font-size:12px; font-weight:700; color:${accent}; text-transform:uppercase; letter-spacing:1.5px; margin-bottom:10px; display:flex; align-items:center; gap:8px; }
  .section-title::before { content:''; width:4px; height:16px; background:${accent}; border-radius:2px; }
  .summary { font-size:13px; color:#333; line-height:1.8; }
  .exp-item { margin-bottom:14px; padding-left:14px; border-left:2px solid ${badge}; }
  .exp-header { display:flex; justify-content:space-between; align-items:baseline; }
  .exp-title { font-size:14px; font-weight:600; color:${grad1}; }
  .exp-duration { font-size:12px; color:${accent}; font-weight:500; }
  .exp-company { font-size:13px; color:#666; margin-bottom:4px; }
  ul { padding-left:16px; }
  li { font-size:13px; color:#444; margin-bottom:3px; line-height:1.6; }
  .edu-item { margin-bottom:10px; }
  .edu-degree { font-size:14px; font-weight:600; color:${grad1}; }
  .edu-school { font-size:13px; color:#666; }
  .skill-badge { display:inline-block; background:${badge}; color:${badgeText}; padding:4px 12px; border-radius:20px; font-size:12px; font-weight:500; margin:2px 2px 2px 0; }
  .proj-name { font-size:14px; font-weight:600; color:${grad1}; }
  .proj-tech { font-size:12px; color:${accent}; }
  .proj-desc { font-size:13px; color:#444; margin-top:3px; }
  .cert-list { padding-left:16px; }
  .cert-list li { font-size:13px; }
</style></head><body>
  <div class="header">
    <div class="header-top">
      <div class="header-left"><h1>${escHtml(resume.name)}</h1><div class="subtitle">${escHtml(resume.summary?.split('.')[0] || '')}</div></div>
      ${photo}
    </div>
    <div class="header-contact">${[resume.contact?.email, resume.contact?.phone, resume.contact?.location, resume.contact?.linkedin, resume.contact?.github].filter(Boolean).map(c=>`<span>${escHtml(c)}</span>`).join('')}</div>
  </div>
  <div class="body">
    ${resume.summary ? `<div class="section"><div class="section-title">About Me</div><p class="summary">${escHtml(resume.summary)}</p></div>` : ''}
    ${resume.experience?.filter(e=>e.title).length ? `<div class="section"><div class="section-title">Experience</div>${experienceSection(resume)}</div>` : ''}
    ${resume.internships?.filter(e=>e.role).length ? `<div class="section"><div class="section-title">Internships</div>${internshipSection(resume)}</div>` : ''}
    ${skills.length ? `<div class="section"><div class="section-title">Skills & Technologies</div><div>${skills.map(s=>`<span class="skill-badge">${escHtml(s)}</span>`).join('')}</div></div>` : ''}
    ${resume.projects?.filter(p=>p.name).length ? `<div class="section"><div class="section-title">Projects</div>${projectsSection(resume)}</div>` : ''}
    ${resume.education?.filter(e=>e.degree).length ? `<div class="section"><div class="section-title">Education</div>${educationSection(resume)}</div>` : ''}
    ${resume.achievements?.filter(Boolean).length ? `<div class="section"><div class="section-title">Key Achievements</div>${achievementsSection(resume)}</div>` : ''}
    ${resume.certifications?.filter(Boolean).length ? `<div class="section"><div class="section-title">Certifications</div>${certificationsSection(resume)}</div>` : ''}
  </div>
</body></html>`;
}

function minimalCleanThemedHTML(resume, profilePhoto, theme) {
  const { accent, line, bg, text } = theme;
  const skills = skillsList(resume);
  const photo  = profilePhoto
    ? `<img src="${profilePhoto}" alt="Profile" style="width:68px;height:68px;border-radius:4px;object-fit:cover;flex-shrink:0;" />`
    : '';
  return `<!DOCTYPE html><html><head><meta charset="utf-8">
<style>
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&display=swap');
  * { margin:0; padding:0; box-sizing:border-box; }
  body { font-family: 'DM Sans', Arial, sans-serif; color:${text}; line-height:1.7; padding:40px 52px; font-size:13px; background:${bg}; min-height:1060px; }
  .header-row { display:flex; justify-content:space-between; align-items:flex-start; gap:20px; margin-bottom:6px; }
  h1 { font-size:26px; font-weight:700; color:${text}; letter-spacing:-0.5px; }
  .contact { font-size:12px; color:${accent}; margin-top:4px; margin-bottom:16px; }
  hr { border:none; border-top:1px solid ${line}; margin:0 0 16px; }
  .section { margin-bottom:16px; }
  .section-title { font-size:11px; font-weight:700; color:${accent}; text-transform:uppercase; letter-spacing:2px; margin-bottom:10px; }
  .summary { font-size:13px; color:${text}; line-height:1.8; opacity:0.85; }
  .exp-item { margin-bottom:12px; }
  .exp-header { display:flex; justify-content:space-between; align-items:baseline; }
  .exp-title { font-size:14px; font-weight:600; color:${text}; }
  .exp-duration { font-size:12px; color:${accent}; }
  .exp-company { font-size:13px; color:${accent}; margin-bottom:4px; opacity:0.8; }
  ul { padding-left:16px; }
  li { font-size:13px; color:${text}; opacity:0.8; margin-bottom:3px; line-height:1.6; }
  .edu-item { margin-bottom:8px; }
  .edu-degree { font-size:14px; font-weight:600; color:${text}; }
  .edu-school { font-size:13px; color:${accent}; }
  .skills-inline { font-size:13px; color:${text}; opacity:0.8; }
  .proj-name { font-size:13px; font-weight:600; color:${text}; }
  .proj-tech { font-size:12px; color:${accent}; }
  .proj-desc { font-size:13px; color:${text}; opacity:0.8; margin-top:2px; }
  .cert-list { padding-left:16px; }
  .cert-list li { font-size:13px; }
</style></head><body>
  <div class="header-row">
    <div style="flex:1"><h1>${escHtml(resume.name)}</h1><div class="contact">${contactLine(resume)}</div></div>
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
  if (design.startsWith('classic-pro')) {
    const theme = CLASSIC_PRO_THEMES[design] || CLASSIC_PRO_THEMES['classic-pro'];
    return classicProThemedHTML(resume, profilePhoto, theme);
  }
  if (design.startsWith('modern-split')) {
    const theme = MODERN_SPLIT_THEMES[design] || MODERN_SPLIT_THEMES['modern-split'];
    return modernSplitThemedHTML(resume, profilePhoto, theme);
  }
  if (design.startsWith('creative-edge')) {
    const theme = CREATIVE_EDGE_THEMES[design] || CREATIVE_EDGE_THEMES['creative-edge'];
    return creativeEdgeThemedHTML(resume, profilePhoto, theme);
  }
  if (design.startsWith('minimal-clean')) {
    const theme = MINIMAL_CLEAN_THEMES[design] || MINIMAL_CLEAN_THEMES['minimal-clean'];
    return minimalCleanThemedHTML(resume, profilePhoto, theme);
  }
  return classicProThemedHTML(resume, profilePhoto, CLASSIC_PRO_THEMES['classic-pro']);
}

async function generatePDF(resume, profilePhoto, design = 'classic-pro') {
  const html = resumeToHTML(resume, profilePhoto || null, design);

  let browser;
  try {
    browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    // A4 at 96dpi = 794×1123px — match viewport to PDF page so content fills exactly
    await page.setViewport({ width: 794, height: 1123, deviceScaleFactor: 1 });
    await page.setContent(html, { waitUntil: 'networkidle0' });

    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: { top: '0px', bottom: '0px', left: '0px', right: '0px' },
      scale: 1.0
    });

    return pdfBuffer;
  } finally {
    if (browser) await browser.close();
  }
}

module.exports = { generatePDF };
