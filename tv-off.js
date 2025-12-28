#!/usr/bin/node
// /home/htpc/bin/tv-off.js
const { LGTV, PowerStates, ResponseParseError } = require('lgtv-ip-control');

const HOST = '192.168.1.3';   // IP della TV
const MAC  = null;             // metti MAC solo se vuoi anche powerOn()
const PIN  = 'F6GO2N8B';       // PIN mostrato nella TV ("Abilita controllo di rete")

(async () => {
  const tv = new LGTV(HOST, MAC, PIN);
  try {
    let powerState;
    try {
      powerState = await tv.getPowerState();
    } catch (err) {
      if (err instanceof ResponseParseError) {
        powerState = PowerStates.on;
      } else {
        throw err;
      }
    }
    if (powerState !== PowerStates.on) {
      console.log('TV già spenta, nessuna azione.');
      return;
    }

    await tv.connect();
    const currentApp = await tv.sendCommand('CURRENT_APP');
    const match = typeof currentApp === 'string' && currentApp.match(/APP:([^\s]+)/);
    const appId = match ? match[1] : null;
    const isHdmi4 = typeof appId === 'string' && /hdmi4/i.test(appId);
    if (!isHdmi4) {
      console.log('TV accesa ma non su HDMI 4, nessuna azione.');
      return;
    }

    await tv.powerOff();
    console.log('📴 TV spenta con IP Control');
  } catch (err) {
    console.error('Errore:', err.message || err);
  } finally {
    try {
      tv.disconnect();
    } catch (_) {
      // ignore
    }
  }
})();
