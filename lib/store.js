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

function rollbackDownload(paymentId) {
  const store = readStore();
  const used = store.downloads[paymentId] || 0;
  if (used <= 0) return { rolledBack: false, currentCount: used };
  if (used === 1) {
    delete store.downloads[paymentId];
  } else {
    store.downloads[paymentId] = used - 1;
  }
  writeStore(store);
  return { rolledBack: true, currentCount: Math.max(0, used - 1) };
}

// Resume ownership — binds an orderId to the name of the person it was generated for.
// Prevents a paid token from being reused to download a different person's resume.
function setResumeOwner(orderId, name) {
  const store = readStore();
  if (!store.owners) store.owners = {};
  store.owners[orderId] = String(name || '').trim().toLowerCase();
  writeStore(store);
}

function getResumeOwner(orderId) {
  return readStore().owners?.[orderId] ?? null;
}

module.exports = { hasPayment, getPayment, setPayment, reserveDownload, rollbackDownload, setResumeOwner, getResumeOwner };
