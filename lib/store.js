const fs = require('fs');
const path = require('path');

const STORE_PATH = path.join(process.cwd(), '.resumejet-store.json');

function readStore() {
  try {
    return JSON.parse(fs.readFileSync(STORE_PATH, 'utf8'));
  } catch {
    return { payments: {}, downloads: {} };
  }
}

function writeStore(data) {
  const tmp = STORE_PATH + '.tmp';
  fs.writeFileSync(tmp, JSON.stringify(data), 'utf8');
  fs.renameSync(tmp, STORE_PATH);
}

// Payments — idempotency store
function hasPayment(paymentId) {
  return !!readStore().payments[paymentId];
}

function getPayment(paymentId) {
  return readStore().payments[paymentId] || null;
}

function setPayment(paymentId, data) {
  const store = readStore();
  store.payments[paymentId] = { ...data, savedAt: Date.now() };
  writeStore(store);
}

// Downloads — per-paymentId counter
// Atomically checks the limit and increments in one synchronous operation so
// two concurrent requests cannot both pass the limit check before either writes.
function reserveDownload(paymentId, downloadsAllowed) {
  const store = readStore();
  const used = store.downloads[paymentId] || 0;
  if (used >= downloadsAllowed) {
    return { allowed: false, used };
  }
  store.downloads[paymentId] = used + 1;
  writeStore(store);
  return { allowed: true, newCount: used + 1 };
}

module.exports = { hasPayment, getPayment, setPayment, reserveDownload };
