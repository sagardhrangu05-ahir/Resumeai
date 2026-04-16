import { generateResume } from '../../lib/claude';
const { v4: uuidv4 } = require('uuid');

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { data, resumeType = 'fresher' } = req.body;
    const orderId = uuidv4();

    const resume = await generateResume(data, resumeType);

    return res.status(200).json({ success: true, resume, orderId });
  } catch (error) {
    console.error('Resume generation error:', error);
    return res.status(500).json({
      success: false,
      error: 'Resume generation failed. Please try again.'
    });
  }
}
