const { escHtml, contactLine, skillsList, experienceSection, internshipSection, educationSection, projectsSection, achievementsSection, certificationsSection } = require('../lib/resume-helpers');

const THEMES = {
  'classic-pro':        { primary: '#1a1a1a', accent: '#444',    bg: '#ffffff' },
  'classic-pro-navy':   { primary: '#1a3a5f', accent: '#2a5f8f', bg: '#ffffff' },
  'classic-pro-green':  { primary: '#1a4a1a', accent: '#2d7a2d', bg: '#ffffff' },
  'classic-pro-maroon': { primary: '#5a1a1a', accent: '#8b2020', bg: '#ffffff' },
};

function generateHTML(resume, profilePhoto, theme) {
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

module.exports = { THEMES, generateHTML };
