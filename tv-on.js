#!/usr/bin/node
// /home/htpc/bin/tv-on.js
const { Inputs, LGTV } = require('lgtv-ip-control');

const HOST = '192.168.1.3'; // IP della TV
const MAC = '34:E6:E6:CF:7E:E4'; // MAC per WOL
const PIN = 'F6GO2N8B'; // PIN mostrato nella TV

const RETRY_MS = 3000;
const CONNECT_TIMEOUT_MS = 45000;
const WAKE_DELAY_MS = 3000;

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

(async () => {
  const tv = new LGTV(HOST, MAC, PIN);
  try {
    // WOL e poi connessione: evita il parsing fragile del CURRENT_APP.
    tv.powerOn();
    await sleep(WAKE_DELAY_MS);
    await connectWithRetry(tv);
    await tv.setInput(Inputs.hdmi4);
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
