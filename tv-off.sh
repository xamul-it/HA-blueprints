#!/usr/bin/node
// /home/htpc/bin/tv-off.js
const { LGTV } = require('lgtv-ip-control');

const HOST = '192.168.1.3';   // IP della TV
const MAC  = null;             // metti MAC solo se vuoi anche powerOn()
const PIN  = 'F6GO2N8B';       // PIN mostrato nella TV ("Abilita controllo di rete")

(async () => {
  try {
    const tv = new LGTV(HOST, MAC, PIN);
    await tv.connect();
    await tv.powerOff();
    await tv.disconnect();
    console.log('📴 TV spenta con IP Control');
  } catch (err) {
    console.error('Errore:', err.message || err);
  }
})();