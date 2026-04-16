import { generatePDF } from '../../lib/pdf-generator';
const crypto = require('crypto');

function verifyDownloadToken(orderId, paymentId, token) {
  if (!orderId || !paymentId || !token) return false;
  const secret   = process.env.RAZORPAY_KEY_SECRET;
  const expected = crypto
    .createHmac('sha256', secret)
    .update(`${orderId}:${paymentId}:download`)
    .digest('hex');
  try {
    return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(token));
  } catch {
    return false;
  }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { resume, downloadToken, paymentId, razorpayOrderId, profilePhoto, design = 'classic-pro' } = req.body;

    if (!resume) {
      return res.status(400).json({ error: 'No resume data' });
    }

    if (!verifyDownloadToken(razorpayOrderId, paymentId, downloadToken)) {
      console.warn('⚠️ Unauthorized PDF download attempt blocked');
      return res.status(403).json({ error: 'Payment verification required. Please complete payment first.' });
    }

    const pdfBuffer = await generatePDF(resume, profilePhoto || null, design);

    const safeName = (resume.name || 'resume').replace(/\s+/g, '_');
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${safeName}_${design}_Resume.pdf"`);
    res.setHeader('Content-Length', pdfBuffer.length);

    return res.send(pdfBuffer);
  } catch (error) {
    console.error('PDF generation error:', error);
    return res.status(500).json({ error: 'PDF generation failed' });
  }
}
