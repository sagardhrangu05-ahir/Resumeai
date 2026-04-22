import { generateResume } from '../../lib/claude';
import { rateLimit } from '../../lib/rate-limit';
const { v4: uuidv4 } = require('uuid');

export const config = {
  api: { bodyParser: { sizeLimit: '2mb' } }
};

const VALID_RESUME_TYPES = ['fresher', 'experienced', 'it-developer', 'mba', 'ats-optimized'];

const MAX_FIELD_LENGTH = 5000;

function sanitizeData(data) {
  if (!data || typeof data !== 'object') return data;
  const sanitized = {};
  for (const [key, value] of Object.entries(data)) {
    if (typeof value === 'string') {
      sanitized[key] = value.substring(0, MAX_FIELD_LENGTH);
    } else if (Array.isArray(value)) {
      sanitized[key] = value.slice(0, 50).map(item =>
        typeof item === 'object' ? sanitizeData(item) : (typeof item === 'string' ? item.substring(0, MAX_FIELD_LENGTH) : item)
      );
    } else if (typeof value === 'object') {
      sanitized[key] = sanitizeData(value);
    } else {
      sanitized[key] = value;
    }
  }
  return sanitized;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const ip = req.headers['x-forwarded-for']?.split(',')[0] || req.socket.remoteAddress;
  if (!rateLimit(ip, { windowMs: 60_000, max: 10 })) {
    return res.status(429).json({ error: 'Too many requests. Please wait a minute.' });
  }

  try {
    const { data, resumeType = 'fresher' } = req.body;

    if (!VALID_RESUME_TYPES.includes(resumeType)) {
      return res.status(400).json({ error: 'Invalid resume type' });
    }

    if (!data || typeof data !== 'object') {
      return res.status(400).json({ error: 'Invalid resume data' });
    }

    const orderId = uuidv4();
    const resume = await generateResume(sanitizeData(data), resumeType);

    return res.status(200).json({ success: true, resume, orderId });
  } catch (error) {
    console.error('Resume generation error:', error);
    return res.status(500).json({
      success: false,
      error: 'Resume generation failed. Please try again.'
    });
  }
}
