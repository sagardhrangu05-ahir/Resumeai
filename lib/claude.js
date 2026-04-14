const Anthropic = require('@anthropic-ai/sdk');

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const SYSTEM_PROMPT = `You are an expert resume writer with 15+ years of experience in HR and recruitment across India and international markets.

## YOUR TASK
Analyze the user's provided data and create a highly professional, ATS-optimized resume.

## RESUME RULES
1. Use clean, professional language — fix grammar, rewrite weak bullet points
2. Every work experience bullet must follow: ACTION VERB + TASK + RESULT/IMPACT format
3. Quantify achievements wherever possible (%, numbers, metrics)
4. Remove irrelevant/outdated information automatically
5. Add a strong Professional Summary (3 lines max) tailored to their experience level
6. Skills section: separate Technical Skills and Soft Skills
7. If fresher (0-2 yrs exp): emphasize projects, internships, education
8. If experienced (3+ yrs): emphasize achievements, leadership, impact
9. Keep it concise — 1 page for <5 yrs experience, max 2 pages otherwise
10. DO NOT fabricate any information — only enhance what is provided

## OUTPUT FORMAT
Return ONLY valid JSON (no markdown, no backticks, no explanation). Use this exact structure:
{
  "name": "",
  "contact": { "email": "", "phone": "", "linkedin": "", "location": "" },
  "summary": "",
  "experience": [
    {
      "title": "",
      "company": "",
      "duration": "",
      "bullets": [""]
    }
  ],
  "education": [
    {
      "degree": "",
      "institution": "",
      "year": "",
      "score": ""
    }
  ],
  "skills": {
    "technical": [""],
    "soft": [""]
  },
  "projects": [
    {
      "name": "",
      "description": "",
      "tech_used": ""
    }
  ],
  "certifications": [""]
}

Return ONLY the JSON. No other text.`;

async function generateResume(userData) {
  const message = await client.messages.create({
    model: 'claude-sonnet-4-5',
    max_tokens: 4000,
    system: SYSTEM_PROMPT,
    messages: [
      {
        role: 'user',
        content: `Here is the user's data. Create their professional resume:\n\n${JSON.stringify(userData, null, 2)}`
      }
    ]
  });

  const text = message.content[0].text.trim();

  // Clean JSON — remove markdown fences if present
  let cleanJson = text;
  if (cleanJson.startsWith('```')) {
    cleanJson = cleanJson.replace(/```json\n?/g, '').replace(/```\n?/g, '');
  }

  return JSON.parse(cleanJson);
}

// Vision API — read resume directly from an image (JPG/PNG)
async function generateResumeFromImage(imageBuffer, mimeType, targetRole) {
  const base64Data = imageBuffer.toString('base64');

  const message = await client.messages.create({
    model: 'claude-sonnet-4-5',
    max_tokens: 4000,
    system: SYSTEM_PROMPT,
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'image',
            source: {
              type: 'base64',
              media_type: mimeType, // 'image/jpeg' or 'image/png'
              data: base64Data,
            }
          },
          {
            type: 'text',
            text: `This is an image of someone's existing resume. Extract ALL information visible in the image and create a professional, ATS-optimized version of it.${targetRole ? ` Target job role: ${targetRole}.` : ''} Return only valid JSON as per the specified format.`
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
