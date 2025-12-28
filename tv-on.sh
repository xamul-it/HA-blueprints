#!/bin/bash
wakeonlan "34:E6:E6:CF:7E:E4"
export DISPLAY=:0
xset dpms force off
node /home/htpc/bin/tv-on.js
