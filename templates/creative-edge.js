const { escHtml, contactLine, skillsList, experienceSection, internshipSection, educationSection, projectsSection, achievementsSection, certificationsSection } = require('../lib/resume-helpers');

const THEMES = {
  'creative-edge':       { grad1: '#1a237e', grad2: '#7c4dff', accent: '#7c4dff', badge: '#ede7f6', badgeText: '#7c4dff' },
  'creative-edge-rose':  { grad1: '#7b0d1e', grad2: '#e84393', accent: '#e84393', badge: '#fce4ec', badgeText: '#e84393' },
  'creative-edge-teal':  { grad1: '#004d40', grad2: '#00bcd4', accent: '#00bcd4', badge: '#e0f7fa', badgeText: '#00838f' },
  'creative-edge-dark':  { grad1: '#0d0d1a', grad2: '#1a237e', accent: '#4fc3f7', badge: '#1a1a3e', badgeText: '#4fc3f7' },
};

function generateHTML(resume, profilePhoto, theme) {
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

module.exports = { THEMES, generateHTML };
