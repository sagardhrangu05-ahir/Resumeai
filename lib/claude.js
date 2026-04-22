const Anthropic = require('@anthropic-ai/sdk');

function getClient() {
  if (!process.env.ANTHROPIC_API_KEY) {
    throw new Error('Missing required environment variable: ANTHROPIC_API_KEY');
  }
  return new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
}

const BASE_RULES = `
## RESUME RULES
1. Use clean, professional language — fix grammar, rewrite weak bullet points
2. Every work experience bullet must follow: ACTION VERB + TASK + RESULT/IMPACT format
3. Quantify achievements wherever possible (%, numbers, metrics)
4. Remove irrelevant/outdated information automatically
5. Skills section: separate Technical Skills and Soft Skills
6. Keep it concise — 1 page for <5 yrs experience, max 2 pages otherwise
7. DO NOT fabricate any information — only enhance what is provided
8. Return ONLY valid JSON (no markdown, no backticks, no explanation)`;

const TYPE_PROMPTS = {
  fresher: `You are an expert resume writer specializing in freshers and new graduates entering the job market.
Focus on: education achievements, academic projects, internships, certifications, and skills potential.
Add a strong Professional Summary highlighting eagerness to learn, relevant coursework, and technical/soft skills.
For internships: frame contributions as achievements with impact.
For projects: highlight tech stack, your role, and outcomes.
${BASE_RULES}`,

  'it-developer': `You are an expert tech resume writer with deep knowledge of software engineering hiring at top Indian and global companies.
Focus on: technical depth, GitHub/portfolio, specific technologies, measurable engineering impact.
Tech Stack section should be comprehensive and ATS-friendly.
Experience bullets: use engineering action verbs (Built, Architected, Optimized, Deployed, Reduced).
Projects: highlight complexity, scale, and tech choices.
${BASE_RULES}`,

  mba: `You are an expert resume writer specializing in MBA graduates and management professionals.
Focus on: leadership impact, team management, business outcomes, P&L responsibility, strategic initiatives.
Experience bullets: emphasize scale (team size, budget, revenue impact), leadership decisions, cross-functional work.
Achievements section: quantified business wins (revenue grown, costs reduced, teams led).
${BASE_RULES}`,

  'ats-optimized': `You are an expert ATS optimization specialist. The user has provided a job description.
Your primary task: extract key skills, requirements, and keywords from the job description and ensure they appear naturally in the resume.
Mirror exact phrases from the JD where the candidate qualifies.
Summary should use role-specific keywords from the JD.
Skills section must include all matched technical and soft skills from the JD.
Experience bullets should naturally incorporate JD keywords.
${BASE_RULES}`,

  experienced: `You are an expert resume writer specializing in mid-to-senior level professionals with work experience.
Focus on: career progression, quantified achievements, leadership, and industry impact.
Experience bullets: use strong action verbs (Led, Managed, Delivered, Increased, Streamlined) with measurable results.
Summary: highlight total years of experience, domain expertise, and key career accomplishments.
Showcase promotions, cross-functional work, and high-impact projects.
${BASE_RULES}`
};

const OUTPUT_FORMAT = `
## OUTPUT FORMAT — Return ONLY this JSON structure:
{
  "name": "",
  "contact": { "email": "", "phone": "", "linkedin": "", "location": "", "github": "" },
  "summary": "",
  "experience": [{ "title": "", "company": "", "duration": "", "bullets": [""] }],
  "internships": [{ "role": "", "company": "", "duration": "", "bullets": [""] }],
  "education": [{ "degree": "", "institution": "", "year": "", "score": "" }],
  "skills": { "technical": [""], "soft": [""] },
  "techStack": [""],
  "projects": [{ "name": "", "description": "", "tech_used": "" }],
  "achievements": [""],
  "certifications": [""]
}
Return ONLY the JSON. No other text.`;

function getSystemPrompt(resumeType) {
  const prompt = TYPE_PROMPTS[resumeType] || TYPE_PROMPTS['fresher'];
  return prompt + OUTPUT_FORMAT;
}

async function generateResume(userData, resumeType = 'fresher') {
  const client = getClient();
  const systemPrompt = getSystemPrompt(resumeType);

  const message = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 4000,
    system: systemPrompt,
    messages: [
      {
        role: 'user',
        content: `Resume Type: ${resumeType}\n\nUser Data:\n${JSON.stringify(userData, null, 2)}\n\nCreate their professional resume.`
      }
    ]
  });

  const text = message.content[0].text.trim();
  let cleanJson = text;
  if (cleanJson.startsWith('```')) {
    cleanJson = cleanJson.replace(/```json\n?/g, '').replace(/```\n?/g, '');
  }
  const parsed = JSON.parse(cleanJson);
  if (!parsed || typeof parsed !== 'object' || !parsed.name) {
    throw new Error('Claude returned invalid resume structure');
  }
  return parsed;
}

async function generateResumeFromImage(imageBuffer, mimeType, targetRole, resumeType = 'fresher') {
  const client = getClient();
  const base64Data  = imageBuffer.toString('base64');
  const systemPrompt = getSystemPrompt(resumeType);

  const message = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 4000,
    system: systemPrompt,
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'image',
            source: { type: 'base64', media_type: mimeType, data: base64Data }
          },
          {
            type: 'text',
            text: `This is an image of someone's existing resume. Resume Type: ${resumeType}.${targetRole ? ` Target job role: ${targetRole}.` : ''} Extract ALL information and create a professional, ATS-optimized version. Return only valid JSON.`
          }
        ]
      }
    ]
  });

  const text = message.content[0].text.trim();
  let cleanJson = text;
  if (cleanJson.startsWith('```')) {
    cleanJson = cleanJson.replace(/```json\n?/g, '').replace(/```\n?/g, '');
  }
  const parsed = JSON.parse(cleanJson);
  if (!parsed || typeof parsed !== 'object' || !parsed.name) {
    throw new Error('Claude returned invalid resume structure');
  }
  return parsed;
}

async function analyzeResume(text, targetRole = '') {
  const client = getClient();
  const MAX_CHARS = 8000;
  const truncated = text.length > MAX_CHARS;
  const prompt = `You are an expert ATS resume analyst. Analyze the resume below and return a JSON object with this EXACT structure:
{
  "ats_score": <number 0-100>,
  "score_label": "<Poor|Average|Good|Excellent>",
  "summary": "<1 sentence overall assessment>",
  "what_to_update": ["<short improvement 1>", "<short improvement 2>", "<short improvement 3>"],
  "issues": [
    { "title": "<issue title>", "desc": "<1 sentence explanation>", "severity": "<high|medium|low>" },
    ... (5 to 7 issues total)
  ]
}

Rules:
- Be honest and specific about actual problems found
- Issues should be concrete and actionable
- ats_score: 0-40 = Poor, 41-65 = Average, 66-80 = Good, 81-100 = Excellent
- Return ONLY valid JSON, no markdown, no explanation
${targetRole ? `- Target role: ${targetRole}` : ''}
${truncated ? `- Note: Resume text was truncated to ${MAX_CHARS} characters for analysis` : ''}

Resume text:
${text.substring(0, MAX_CHARS)}`;

  const message = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 1500,
    messages: [{ role: 'user', content: prompt }]
  });

  const raw = message.content[0].text.trim()
    .replace(/```json\n?/g, '').replace(/```\n?/g, '');
  return JSON.parse(raw);
}

async function analyzeResumeFromImage(imageBuffer, mimeType, targetRole = '') {
  const client = getClient();
  const base64Data = imageBuffer.toString('base64');

  const message = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 1500,
    messages: [{
      role: 'user',
      content: [
        { type: 'image', source: { type: 'base64', media_type: mimeType, data: base64Data } },
        { type: 'text', text: `You are an expert ATS resume analyst. Analyze this resume image and return a JSON object with this EXACT structure:
{
  "ats_score": <number 0-100>,
  "score_label": "<Poor|Average|Good|Excellent>",
  "summary": "<1 sentence overall assessment>",
  "what_to_update": ["<short improvement 1>", "<short improvement 2>", "<short improvement 3>"],
  "issues": [
    { "title": "<issue title>", "desc": "<1 sentence explanation>", "severity": "<high|medium|low>" },
    ... (5 to 7 issues total)
  ]
}
${targetRole ? `Target role: ${targetRole}.` : ''}
Return ONLY valid JSON, no markdown, no explanation.` }
      ]
    }]
  });

  const raw = message.content[0].text.trim()
    .replace(/```json\n?/g, '').replace(/```\n?/g, '');
  return JSON.parse(raw);
}

module.exports = { generateResume, generateResumeFromImage, analyzeResume, analyzeResumeFromImage };
