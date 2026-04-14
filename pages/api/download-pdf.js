import { generatePDF } from '../../lib/pdf-generator';
const crypto = require('crypto');

// Verify the download token matches what server generated at payment time
function verifyDownloadToken(orderId, paymentId, token) {
  if (!orderId || !paymentId || !token) return false;
  const secret = process.env.RAZORPAY_KEY_SECRET;
  const expected = crypto
    .createHmac('sha256', secret)
    .update(`${orderId}:${paymentId}:download`)
    .digest('hex');
  return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(token));
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { resume, downloadToken, paymentId, razorpayOrderId, profilePhoto } = req.body;

    if (!resume) {
      return res.status(400).json({ error: 'No resume data' });
    }

    // 🔒 SECURITY: Verify payment token before generating PDF
    if (!verifyDownloadToken(razorpayOrderId, paymentId, downloadToken)) {
      console.warn('⚠️ Unauthorized PDF download attempt blocked');
      return res.status(403).json({ error: 'Payment verification required. Please complete payment first.' });
    }

    const pdfBuffer = await generatePDF(resume, profilePhoto || null);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${(resume.name || 'resume').replace(/\s+/g, '_')}_Resume.pdf"`);
    res.setHeader('Content-Length', pdfBuffer.length);

    return res.send(pdfBuffer);
  } catch (error) {
    console.error('PDF generation error:', error);
    return res.status(500).json({ error: 'PDF generation failed' });
  }
}
