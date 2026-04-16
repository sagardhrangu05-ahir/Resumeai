import { createOrder } from '../../lib/razorpay';
import { PLANS } from '../../config/pricing';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { orderId, plan: planId = 'basic' } = req.body;

    const planConfig = PLANS.find(p => p.id === planId);
    const amount     = planConfig ? planConfig.razorpayAmount : 4900;

    const order = await createOrder(amount, orderId || `resume_${Date.now()}`);

    return res.status(200).json({
      success: true,
      razorpayOrderId: order.id,
      amount: order.amount,
      currency: order.currency,
      plan: planId
    });
  } catch (error) {
    console.error('Order creation error:', error);
    return res.status(500).json({
      success: false,
      error: 'Could not create payment order'
    });
  }
}
