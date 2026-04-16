const CREDITS_KEY = 'resumeCredits';
const EXPIRY_DAYS = 7;

export function getCredits() {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(CREDITS_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw);
    if (Date.now() > data.expiresAt) {
      localStorage.removeItem(CREDITS_KEY);
      return null;
    }
    return data;
  } catch {
    return null;
  }
}

export function setCredits({ plan, downloadToken, paymentId, razorpayOrderId }) {
  if (typeof window === 'undefined') return null;
  const credits = plan === 'pro' ? 4 : 2;
  const data = {
    credits,
    plan,
    downloadToken,
    paymentId,
    razorpayOrderId,
    expiresAt: Date.now() + EXPIRY_DAYS * 24 * 60 * 60 * 1000
  };
  localStorage.setItem(CREDITS_KEY, JSON.stringify(data));
  return data;
}

export function useCredit() {
  if (typeof window === 'undefined') return null;
  const data = getCredits();
  if (!data || data.credits <= 0) return null;
  data.credits -= 1;
  localStorage.setItem(CREDITS_KEY, JSON.stringify(data));
  return data;
}

export function clearCredits() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(CREDITS_KEY);
}
