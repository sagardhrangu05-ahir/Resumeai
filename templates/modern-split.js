const { escHtml, contactLine, skillsList, experienceSection, internshipSection, educationSection, projectsSection, achievementsSection } = require('../lib/resume-helpers');

const THEMES = {
  'modern-split':        { sidebar: '#1e3a5f', accent: '#2196F3', bg: '#f8f9fa' },
  'modern-split-purple': { sidebar: '#2d1b5e', accent: '#7c4dff', bg: '#f5f0ff' },
  'modern-split-teal':   { sidebar: '#1a4a4a', accent: '#00BCD4', bg: '#f0fafa' },
  'modern-split-orange': { sidebar: '#3a2000', accent: '#FF8C00', bg: '#fff8f0' },
};

function generateHTML(resume, profilePhoto, theme) {
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

module.exports = { THEMES, generateHTML };
