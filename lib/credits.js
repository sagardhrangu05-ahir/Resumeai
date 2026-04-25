const CREDITS_KEY = 'resumeCredits';
const SESSION_KEY = 'resumeSession';
const EXPIRY_DAYS = 7;

export function saveSession({ resumeData, orderId, profilePhoto, selectedDesign }) {
  if (typeof window === 'undefined') return null;
  const sessionData = {
    resumeData: typeof resumeData === 'string' ? resumeData : JSON.stringify(resumeData),
    orderId: orderId || '',
    profilePhoto: profilePhoto || null,
    selectedDesign: selectedDesign || 'classic-pro',
  };
  localStorage.setItem(SESSION_KEY, JSON.stringify(sessionData));
  return sessionData;
}

export function getCredits() {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(CREDITS_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw);
    if (Date.now() > data.expiresAt) {
      localStorage.removeItem(CREDITS_KEY);
      localStorage.removeItem(SESSION_KEY);
      return null;
    }
    return data;
  } catch {
    return null;
  }
}

// downloadsAllowed comes from the server-signed token — not user-controllable
export function setCredits({ plan, downloadToken, paymentId, razorpayOrderId, downloadsAllowed }) {
  if (typeof window === 'undefined') return null;
  const data = {
    // creditsDisplay is for UI only; real limit enforced server-side
    creditsDisplay: downloadsAllowed ?? (plan === 'pro' ? 4 : 2),
    plan,
    downloadToken,
    paymentId,
    razorpayOrderId,
    expiresAt: Date.now() + EXPIRY_DAYS * 24 * 60 * 60 * 1000
  };
  localStorage.setItem(CREDITS_KEY, JSON.stringify(data));
  saveSession({
    resumeData: sessionStorage.getItem('resumeData'),
    orderId: sessionStorage.getItem('orderId'),
    profilePhoto: sessionStorage.getItem('profilePhoto'),
    selectedDesign: sessionStorage.getItem('selectedDesign'),
  });
  return data;
}

export function getSession() {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

// Decrement display counter for UI — server enforces the real limit
export function useCredit() {
  if (typeof window === 'undefined') return null;
  const data = getCredits();
  if (!data) return null;
  if (data.creditsDisplay > 0) {
    data.creditsDisplay -= 1;
    localStorage.setItem(CREDITS_KEY, JSON.stringify(data));
  }
  return data;
}

export function clearCredits() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(CREDITS_KEY);
  localStorage.removeItem(SESSION_KEY);
}
