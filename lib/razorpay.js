const Razorpay = require('razorpay');
const crypto = require('crypto');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

async function createOrder(amount, receipt) {
  const order = await razorpay.orders.create({
    amount: amount, // in paise
    currency: 'INR',
    receipt: receipt,
    notes: { product: 'AI Resume Builder' }
  });
  return order;
}

function verifySignature(orderId, paymentId, signature) {
  const body = orderId + '|' + paymentId;
  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(body)
    .digest('hex');

  return expectedSignature === signature;
}

module.exports = { createOrder, verifySignature };
