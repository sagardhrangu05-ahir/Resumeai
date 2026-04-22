import { generatePDF } from '../../lib/pdf-generator';
import { reserveDownload } from '../../lib/store';
const crypto = require('crypto');

export const config = {
  api: { bodyParser: { sizeLimit: '5mb' } }
};

const VALID_DESIGNS = [
  'classic-pro', 'classic-pro-navy', 'classic-pro-green', 'classic-pro-maroon',
  'modern-split', 'modern-split-purple', 'modern-split-teal', 'modern-split-orange',
  'creative-edge', 'creative-edge-rose', 'creative-edge-teal', 'creative-edge-dark',
  'minimal-clean', 'minimal-clean-blue', 'minimal-clean-green', 'minimal-clean-gold'
];

// Decode and verify the signed token issued by verify-payment.js
// Token format: base64(payload).hmac
function verifyAndDecodeToken(token) {
  if (!token || typeof token !== 'string') return null;
  const dotIdx = token.lastIndexOf('.');
  if (dotIdx === -1) return null;
  const encoded = token.slice(0, dotIdx);
  const sig = token.slice(dotIdx + 1);
  if (!encoded || !sig) return null;

  const secret = process.env.RAZORPAY_KEY_SECRET;
  const expected = crypto.createHmac('sha256', secret).update(encoded).digest('hex');

  try {
    const expectedBuf = Buffer.from(expected, 'hex');
    const sigBuf = Buffer.from(sig, 'hex');
    if (expectedBuf.length !== sigBuf.length) return null;
    if (!crypto.timingSafeEqual(expectedBuf, sigBuf)) return null;
  } catch {
    return null;
  }

  try {
    return JSON.parse(Buffer.from(encoded, 'base64').toString('utf8'));
  } catch {
    return null;
  }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { resume, downloadToken, profilePhoto } = req.body;
    const design = VALID_DESIGNS.includes(req.body.design) ? req.body.design : 'classic-pro';

    if (!resume) {
      return res.status(400).json({ error: 'No resume data' });
    }

    if (resume.name && resume.name.length > 200) {
      return res.status(400).json({ error: 'Invalid resume data' });
    }

    // Verify token signature and decode plan info
    const tokenData = verifyAndDecodeToken(downloadToken);
    if (!tokenData) {
      console.warn('⚠️ Invalid download token');
      return res.status(403).json({ error: 'Payment verification required. Please complete payment first.' });
    }

    const { paymentId, downloadsAllowed } = tokenData;

    // Atomically check + reserve before the async PDF generation so two concurrent
    // requests cannot both pass the limit check before either writes.
    const { allowed, used, newCount } = reserveDownload(paymentId, downloadsAllowed);
    if (!allowed) {
      console.warn(`⚠️ Download limit exceeded: paymentId=${paymentId}, used=${used}, allowed=${downloadsAllowed}`);
      return res.status(403).json({ error: `Download limit reached. Your plan includes ${downloadsAllowed} download(s).` });
    }

    // Validate profilePhoto — only allow base64 data URIs
    let safePhoto = null;
    if (profilePhoto && typeof profilePhoto === 'string') {
      if (/^data:image\/(jpeg|png|webp);base64,[A-Za-z0-9+/=]+$/.test(profilePhoto)) {
        safePhoto = profilePhoto;
      }
    }

    const pdfBuffer = await generatePDF(resume, safePhoto, design);

    console.log(`📥 Download ${newCount}/${downloadsAllowed} for paymentId=${paymentId}`);

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
