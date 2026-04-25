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

module.exports = {
  escHtml,
  contactLine,
  skillsList,
  experienceSection,
  internshipSection,
  educationSection,
  projectsSection,
  achievementsSection,
  certificationsSection,
};
