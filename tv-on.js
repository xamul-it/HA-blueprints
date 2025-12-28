#!/usr/bin/node
// /home/htpc/bin/tv-on.js
const { LGTV } = require('lgtv-ip-control');

const HOST = '192.168.1.3'; // IP della TV
const MAC = '34:E6:E6:CF:7E:E4'; // MAC per WOL
const PIN = 'F6GO2N8B'; // PIN mostrato nella TV

const TARGET_LABELS = ['HDMI 4', 'HDMI4', 'HDMI_4'];
const RETRY_MS = 3000;
const CONNECT_TIMEOUT_MS = 45000;

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function connectWithRetry(tv) {
  const start = Date.now();
  while (true) {
    try {
      await tv.connect();
      return;
    } catch (err) {
      if (Date.now() - start >= CONNECT_TIMEOUT_MS) {
        throw err;
      }
      await sleep(RETRY_MS);
    }
  }
}

async function resolveInputId(tv) {
  if (typeof tv.getInputList === 'function') {
    const inputs = await tv.getInputList();
    const target = inputs.find((i) =>
      TARGET_LABELS.includes((i.label || i.name || i.id || '').toString())
    );
    if (target) {
      return target.id || target.label || target.name;
    }
  }
  return 'HDMI_4';
}

async function setInput(tv, inputId) {
  const fn =
    tv.setInput ||
    tv.setInputById ||
    tv.setInputChannel;
  if (typeof fn !== 'function') {
    throw new Error('setInput non disponibile nella libreria');
  }
  await fn.call(tv, inputId);
}

(async () => {
  const tv = new LGTV(HOST, MAC, PIN);
  try {
    await connectWithRetry(tv);
    const inputId = await resolveInputId(tv);
    await setInput(tv, inputId);
    await tv.disconnect();
    console.log('Input impostato su HDMI 4');
  } catch (err) {
    try {
      await tv.disconnect();
    } catch (_) {
      // ignore
    }
    console.error('Errore:', err.message || err);
    process.exitCode = 1;
  }
})();
