const puppeteer = require('puppeteer');

function resumeToHTML(resume, profilePhoto) {
  const skills = [
    ...(resume.skills?.technical || []),
    ...(resume.skills?.soft || [])
  ];

  const photoHtml = profilePhoto
    ? `<img src="${profilePhoto}" alt="Profile"
         style="width:80px;height:80px;border-radius:50%;object-fit:cover;
                border:2px solid #FFD700;flex-shrink:0;" />`
    : '';

  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');

  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    font-family: 'Poppins', Arial, sans-serif;
    color: #1a1a1a;
    line-height: 1.5;
    padding: 40px 48px;
    font-size: 11px;
  }

  .header-row {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 16px;
    margin-bottom: 4px;
  }

  h1 {
    font-size: 24px;
    font-weight: 700;
    color: #111;
  }

  .contact {
    font-size: 11px;
    color: #555;
    margin-bottom: 16px;
    padding-bottom: 12px;
    border-bottom: 2px solid #FFD700;
  }

  .section { margin-bottom: 16px; }

  .section-title {
    font-size: 12px;
    font-weight: 700;
    color: #FFFFFF;
    background: #1a1a1a;
    padding: 4px 10px;
    border-radius: 3px;
    margin-bottom: 8px;
    text-transform: uppercase;
    letter-spacing: 1px;
  }

  .summary { font-size: 11px; color: #333; line-height: 1.6; }

  .exp-item { margin-bottom: 12px; }
  .exp-header { display: flex; justify-content: space-between; align-items: baseline; }
  .exp-title  { font-size: 13px; font-weight: 600; color: #111; }
  .exp-duration { font-size: 10px; color: #777; }
  .exp-company  { font-size: 11px; color: #444; margin-bottom: 4px; }

  ul { padding-left: 18px; }
  li { font-size: 11px; color: #333; margin-bottom: 3px; line-height: 1.5; }

  .edu-item   { margin-bottom: 8px; }
  .edu-degree { font-size: 12px; font-weight: 600; }
  .edu-school { font-size: 11px; color: #444; }

  .skills-list {
    display: flex; flex-wrap: wrap; gap: 6px;
    list-style: none; padding: 0;
  }
  .skills-list li {
    background: #f0f0f0; padding: 3px 10px;
    border-radius: 12px; font-size: 10px; margin-bottom: 0;
  }

  .proj-name { font-size: 12px; font-weight: 600; }
  .proj-tech { font-size: 10px; color: #777; }
  .proj-desc { font-size: 11px; color: #333; }

  .cert-list { padding-left: 18px; }
  .cert-list li { font-size: 11px; }
</style>
</head>
<body>

  <div class="header-row">
    <div style="flex:1;">
      <h1>${resume.name || ''}</h1>
      <div class="contact">
        ${[
          resume.contact?.email,
          resume.contact?.phone,
          resume.contact?.location,
          resume.contact?.linkedin
        ].filter(Boolean).join(' • ')}
      </div>
    </div>
    ${photoHtml}
  </div>

  ${resume.summary ? `
  <div class="section">
    <div class="section-title">Professional Summary</div>
    <p class="summary">${resume.summary}</p>
  </div>` : ''}

  ${resume.experience?.length > 0 && resume.experience[0]?.title ? `
  <div class="section">
    <div class="section-title">Work Experience</div>
    ${resume.experience.map(exp => `
    <div class="exp-item">
      <div class="exp-header">
        <span class="exp-title">${exp.title}</span>
        <span class="exp-duration">${exp.duration || ''}</span>
      </div>
      <div class="exp-company">${exp.company || ''}</div>
      ${exp.bullets?.length ? `<ul>${exp.bullets.map(b => `<li>${b}</li>`).join('')}</ul>` : ''}
    </div>`).join('')}
  </div>` : ''}

  ${resume.education?.length > 0 && resume.education[0]?.degree ? `
  <div class="section">
    <div class="section-title">Education</div>
    ${resume.education.map(edu => `
    <div class="edu-item">
      <div class="exp-header">
        <span class="edu-degree">${edu.degree}</span>
        <span class="exp-duration">${edu.year || ''}</span>
      </div>
      <div class="edu-school">${edu.institution || ''} ${edu.score ? `• ${edu.score}` : ''}</div>
    </div>`).join('')}
  </div>` : ''}

  ${skills.length > 0 ? `
  <div class="section">
    <div class="section-title">Skills</div>
    <ul class="skills-list">
      ${skills.map(s => `<li>${s}</li>`).join('')}
    </ul>
  </div>` : ''}

  ${resume.projects?.length > 0 && resume.projects[0]?.name ? `
  <div class="section">
    <div class="section-title">Projects</div>
    ${resume.projects.map(p => `
    <div style="margin-bottom: 8px;">
      <span class="proj-name">${p.name}</span>
      ${p.tech_used ? `<span class="proj-tech"> (${p.tech_used})</span>` : ''}
      <p class="proj-desc">${p.description || ''}</p>
    </div>`).join('')}
  </div>` : ''}

  ${resume.certifications?.length > 0 && resume.certifications[0] ? `
  <div class="section">
    <div class="section-title">Certifications</div>
    <ul class="cert-list">
      ${resume.certifications.map(c => `<li>${c}</li>`).join('')}
    </ul>
  </div>` : ''}

</body>
</html>`;
}

async function generatePDF(resume, profilePhoto) {
  const html = resumeToHTML(resume, profilePhoto || null);

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
