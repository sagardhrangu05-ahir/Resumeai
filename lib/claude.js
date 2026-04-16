const Anthropic = require('@anthropic-ai/sdk');

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

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
  const systemPrompt = getSystemPrompt(resumeType);

  const message = await client.messages.create({
    model: 'claude-sonnet-4-5',
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
  return JSON.parse(cleanJson);
}

async function generateResumeFromImage(imageBuffer, mimeType, targetRole, resumeType = 'fresher') {
  const base64Data  = imageBuffer.toString('base64');
  const systemPrompt = getSystemPrompt(resumeType);

  const message = await client.messages.create({
    model: 'claude-sonnet-4-5',
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
  return JSON.parse(cleanJson);
}

module.exports = { generateResume, generateResumeFromImage };
