#!/bin/sh

# I run this script using SUDO. Xauth gets totally lost w/ SUDO, 
# so I re-export the .Xauthority stuff whenever I kick off tpb.

export DISPLAY=:0.0
export XAUTHORITY=/home/<user>/.Xauthority

TPB_RUNNING=`ps -C tpb e | grep usr/bin/tpb`
if [[ "${TPB_RUNNING}x" == "x" ]]; then
    echo "starting tpb"
    /usr/bin/tpb -d
fi
