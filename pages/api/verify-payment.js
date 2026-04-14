import { verifySignature } from '../../lib/razorpay';
const crypto = require('crypto');

// Generate a signed download token (no DB needed)
function generateDownloadToken(orderId, paymentId) {
  const secret = process.env.RAZORPAY_KEY_SECRET;
  return crypto
    .createHmac('sha256', secret)
    .update(`${orderId}:${paymentId}:download`)
    .digest('hex');
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderId
    } = req.body;

    const isValid = verifySignature(
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    );

    if (isValid) {
      console.log(`✅ Payment SUCCESS: Order ${orderId}, Payment ${razorpay_payment_id}`);

      // Generate a one-time download token — only server can create this
      const downloadToken = generateDownloadToken(razorpay_order_id, razorpay_payment_id);

      return res.status(200).json({
        success: true,
        message: 'Payment verified successfully',
        downloadToken,
        paymentId: razorpay_payment_id,
        razorpayOrderId: razorpay_order_id
      });
    } else {
      console.log(`❌ Payment FAILED verification: ${razorpay_order_id}`);
      return res.status(400).json({
        success: false,
        error: 'Payment verification failed'
      });
    }
  } catch (error) {
    console.error('Verification error:', error);
    return res.status(500).json({
      success: false,
      error: 'Payment verification error'
    });
  }
}
