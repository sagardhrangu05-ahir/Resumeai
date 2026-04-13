import { generateResume } from '../../lib/claude';
import { v4 as uuidv4 } from 'uuid';

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { data } = req.body;
    const orderId = uuidv4();

    // Call Claude AI to generate resume
    const resume = await generateResume(data);

    return res.status(200).json({
      success: true,
      resume,
      orderId
    });
  } catch (error) {
    console.error('Resume generation error:', error);
    return res.status(500).json({
      success: false,
      error: 'Resume generation failed. Please try again.'
    });
  }
}
