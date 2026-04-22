import { verifySignature, fetchPayment } from '../../lib/razorpay';
import { PLANS } from '../../config/pricing';
import { hasPayment, getPayment, setPayment } from '../../lib/store';
const { sendPaymentReceipt } = require('../../lib/email');
const crypto = require('crypto');

const VALID_PLAN_IDS = PLANS.map(p => p.id);

// Token encodes plan + downloadsAllowed so server can verify on download
function generateDownloadToken(paymentId, orderId, plan, downloadsAllowed) {
  const secret = process.env.RAZORPAY_KEY_SECRET;
  const payload = Buffer.from(JSON.stringify({ paymentId, orderId, plan, downloadsAllowed, issuedAt: Date.now() })).toString('base64');
  const sig = crypto.createHmac('sha256', secret).update(payload).digest('hex');
  return `${payload}.${sig}`;
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
      orderId,
      plan: rawPlan = 'basic'
    } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ success: false, error: 'Missing payment fields' });
    }

    const plan = VALID_PLAN_IDS.includes(rawPlan) ? rawPlan : 'basic';
    const planConfig = PLANS.find(p => p.id === plan);

    // Idempotency — return cached result for already-processed payments (file-backed)
    if (hasPayment(razorpay_payment_id)) {
      return res.status(200).json(getPayment(razorpay_payment_id));
    }

    // Step 1: Verify Razorpay signature
    const isValid = verifySignature(razorpay_order_id, razorpay_payment_id, razorpay_signature);
    if (!isValid) {
      console.log(`❌ Signature FAILED: ${razorpay_order_id}`);
      return res.status(400).json({ success: false, error: 'Payment verification failed' });
    }

    // Step 2: Verify actual amount paid via Razorpay API (prevents ₹1 attacks)
    let rzpPayment;
    try {
      rzpPayment = await fetchPayment(razorpay_payment_id);
    } catch (err) {
      console.error('Razorpay fetch error:', err);
      return res.status(502).json({ success: false, error: 'Could not verify payment amount. Please contact support.' });
    }

    if (rzpPayment.status !== 'captured') {
      console.warn(`⚠️ Payment not captured: ${razorpay_payment_id}, status: ${rzpPayment.status}`);
      return res.status(400).json({ success: false, error: 'Payment not completed' });
    }

    if (rzpPayment.amount !== planConfig.razorpayAmount) {
      console.warn(`⚠️ Amount mismatch: paid ${rzpPayment.amount}, expected ${planConfig.razorpayAmount}`);
      return res.status(400).json({ success: false, error: 'Payment amount does not match selected plan' });
    }

    console.log(`✅ Payment verified: ${razorpay_payment_id}, plan=${plan}, amount=₹${planConfig.price}`);

    // Send receipt email (non-blocking — don't fail payment if email fails)
    const userEmail = rzpPayment.email;
    const userName  = rzpPayment.contact ? String(rzpPayment.contact) : '';
    if (userEmail) {
      sendPaymentReceipt({
        toEmail: userEmail,
        toName: userName,
        plan,
        amount: planConfig.price,
        paymentId: razorpay_payment_id,
        downloadsAllowed: planConfig.downloads,
      }).catch(err => console.error('Receipt email failed:', err));
    }

    const downloadToken = generateDownloadToken(razorpay_payment_id, razorpay_order_id, plan, planConfig.downloads);

    const result = {
      success: true,
      message: 'Payment verified successfully',
      downloadToken,
      paymentId: razorpay_payment_id,
      razorpayOrderId: razorpay_order_id,
      plan,
      downloadsAllowed: planConfig.downloads,
    };

    // Persist to file store — survives server restarts
    setPayment(razorpay_payment_id, result);

    return res.status(200).json(result);
  } catch (error) {
    console.error('Verification error:', error);
    return res.status(500).json({ success: false, error: 'Payment verification error' });
  }
}
