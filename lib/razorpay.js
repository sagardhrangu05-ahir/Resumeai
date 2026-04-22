const Razorpay = require('razorpay');
const crypto = require('crypto');

function getRazorpayInstance() {
  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    throw new Error('Missing required environment variables: RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET');
  }
  return new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
}

async function createOrder(amount, receipt) {
  const razorpay = getRazorpayInstance();
  const order = await razorpay.orders.create({
    amount: amount,
    currency: 'INR',
    receipt: receipt,
    notes: { product: 'AI Resume Builder' }
  });
  return order;
}

async function fetchPayment(paymentId) {
  const razorpay = getRazorpayInstance();
  return razorpay.payments.fetch(paymentId);
}

function verifySignature(orderId, paymentId, signature) {
  if (!process.env.RAZORPAY_KEY_SECRET) {
    throw new Error('Missing RAZORPAY_KEY_SECRET');
  }
  const body = orderId + '|' + paymentId;
  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(body)
    .digest('hex');

  const expectedBuf = Buffer.from(expectedSignature);
  const signatureBuf = Buffer.from(signature);
  if (expectedBuf.length !== signatureBuf.length) return false;
  try {
    return crypto.timingSafeEqual(expectedBuf, signatureBuf);
  } catch {
    return false;
  }
}

module.exports = { createOrder, verifySignature, fetchPayment };
