#!/usr/bin/env python3
import gi
gi.require_version("Gio", "2.0")
from gi.repository import Gio, GLib
import subprocess
import os

# PATH ai tuoi script Node
TV_ON_SCRIPT = "/home/htpc/bin/tv-on.js"
TV_OFF_SCRIPT = "/home/htpc/bin/tv-off.js"

SCRIPT_TIMEOUT_SEC = 10

# opzionale: log semplice su stdout
def log(msg):
    print(msg, flush=True)

def run_script(label, cmd):
    try:
        result = subprocess.run(
            cmd,
            capture_output=True,
            text=True,
            timeout=SCRIPT_TIMEOUT_SEC,
        )
        if result.returncode != 0:
            err = (result.stderr or "").strip()
            log(f"{label} fallito (rc={result.returncode}): {err or 'nessun dettaglio'}")
        return result.returncode == 0
    except subprocess.TimeoutExpired:
        log(f"{label} timeout dopo {SCRIPT_TIMEOUT_SEC}s")
    except Exception as e:
        log(f"{label} errore: {e}")
    return False

def on_screensaver_signal(connection, sender_name, object_path,
                          interface_name, signal_name, parameters, user_data):
    # parameters e' un GLib.Variant, contiene un solo booleano
    active = parameters.unpack()[0]

    if active:
        log("Screensaver attivo: spengo TV")
        run_script("tv-off", ["node", TV_OFF_SCRIPT])
    else:
        log("Screensaver disattivo: accendo TV")
        run_script("tv-on", ["node", TV_ON_SCRIPT])

def main():
    # bus della sessione (non serve DISPLAY/XAUTH)
    bus = Gio.bus_get_sync(Gio.BusType.SESSION, None)

    # ci iscriviamo ai segnali di org.gnome.ScreenSaver
    bus.signal_subscribe(
        None,                        # sender (qualsiasi)
        "org.gnome.ScreenSaver",     # interfaccia
        "ActiveChanged",             # nome segnale
        "/org/gnome/ScreenSaver",    # object path
        None,                        # arg0
        Gio.DBusSignalFlags.NONE,
        on_screensaver_signal,       # callback
        None                         # user_data
    )

    log("In ascolto su org.gnome.ScreenSaver.ActiveChanged...")
    loop = GLib.MainLoop()
    loop.run()

if __name__ == "__main__":
    main()
