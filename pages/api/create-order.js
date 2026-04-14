import { createOrder } from '../../lib/razorpay';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { orderId } = req.body;
    const amount = parseInt(process.env.PRICE_AMOUNT || '4900'); // ₹49 in paise

    const order = await createOrder(amount, orderId || `resume_${Date.now()}`);

    return res.status(200).json({
      success: true,
      razorpayOrderId: order.id,
      amount: order.amount,
      currency: order.currency
    });
  } catch (error) {
    console.error('Order creation error:', error);
    return res.status(500).json({
      success: false,
      error: 'Could not create payment order'
    });
  }
}
