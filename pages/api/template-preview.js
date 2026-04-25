const { RESUME_DESIGNS } = require('../../config/resumeDesigns');

const TEMPLATE_MAP = {
  'classic-pro':   require('../../templates/classic-pro'),
  'modern-split':  require('../../templates/modern-split'),
  'creative-edge': require('../../templates/creative-edge'),
  'minimal-clean': require('../../templates/minimal-clean'),
  'executive-pro': require('../../templates/executive-pro'),
};

const SAMPLE_RESUME = {
  name: 'Priya Sharma',
  contact: {
    email: 'priya@email.com',
    phone: '+91 98765 43210',
    location: 'Bangalore, India',
    linkedin: 'linkedin.com/in/priyasharma',
    github: 'github.com/priyasharma',
  },
  summary: 'Results-driven Software Engineer with 5+ years building scalable web applications for fintech and e-commerce platforms. Reduced system latency by 40%, led cross-functional teams of 6+ engineers, and delivered features serving 2M+ users.',
  experience: [
    {
      title: 'Senior Software Engineer',
      company: 'Razorpay',
      duration: '2023–Present',
      bullets: [
        'Led migration to microservices, reducing API response time by 42% and handling 500K+ daily transactions.',
        'Mentored 6 junior developers; improved deployment frequency by 3x.',
        'Shipped 12 major features, increasing merchant retention by 18% YoY.',
      ],
    },
    {
      title: 'Software Engineer',
      company: 'Flipkart',
      duration: '2021–2022',
      bullets: [
        'Built React components used by 2M+ daily users, improving page load by 35%.',
        'Reduced AWS infrastructure costs by ₹8 lakhs/year by optimizing Lambda and EC2.',
      ],
    },
  ],
  education: [
    { degree: 'B.Tech, Computer Science', institution: 'VIT University, Vellore', year: '2020', score: '8.9 CGPA · First Class with Distinction' },
  ],
  skills: {
    technical: ['React', 'Node.js', 'TypeScript', 'AWS', 'PostgreSQL', 'Python'],
    soft: ['Leadership', 'Communication', 'Problem Solving'],
  },
  techStack: ['Docker', 'Redis', 'GraphQL', 'Kubernetes', 'Figma'],
  certifications: ['AWS Certified Solutions Architect (2024)', 'Meta Frontend Developer (2023)'],
  achievements: [
    'Winner — Razorpay Internal Hackathon 2024 (Best Fintech Innovation)',
    'Speaker — ReactFoo Bangalore 2023: "Scaling React at 2M users"',
  ],
  projects: [
    {
      name: 'Fraud Detection System',
      tech_used: 'Node.js, Redis, ML',
      description: 'Real-time fraud detection system preventing ₹3.2 Cr in losses within 8 months of launch.',
    },
  ],
};

const VALID_IDS = new Set((RESUME_DESIGNS || []).map(d => d.id));

function renderDesignHTML(design, resume, profilePhoto) {
  const styleKey = Object.keys(TEMPLATE_MAP).find(s => design.startsWith(s)) || 'classic-pro';
  const tpl   = TEMPLATE_MAP[styleKey];
  const theme = tpl.THEMES[design] || tpl.THEMES[Object.keys(tpl.THEMES)[0]];
  return tpl.generateHTML(resume, profilePhoto || null, theme);
}

export default function handler(req, res) {
  if (req.method === 'POST') {
    const { design = 'classic-pro', resume, profilePhoto = null } = req.body || {};
    if (!VALID_IDS.has(design)) {
      return res.status(400).json({ error: 'Invalid design ID' });
    }
    if (!resume || typeof resume !== 'object') {
      return res.status(400).json({ error: 'Invalid resume data' });
    }

    const html = renderDesignHTML(design, resume, profilePhoto);
    return res.status(200).json({ success: true, html });
  }

  const design = req.query.design || 'classic-pro';

  if (!VALID_IDS.has(design)) {
    return res.status(400).send('<h3>Invalid design ID</h3>');
  }

  const html = renderDesignHTML(design, SAMPLE_RESUME, null);

  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Cache-Control', 'public, max-age=3600');
  res.status(200).send(html);
}
