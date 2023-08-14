---
aliases:
  - /articles/72/docker-script-for-anyconnect-on-osx
tags:
  - docker
  - hardware-mac
  - vpn
  - scripts
title: Docker script for AnyConnect on OSX
---
{{< raw_html >}}
<p>I am queen of laziness, and I have to use AnyConnect, and that screws with Docker, and then I have to go looking to remember the magic incantation to get things right...</p>

<p>Who has time for that? </p>

<p>I made a script that wraps the whole thing up and reminds me what I should do when it doesn't work.</p>

<p>Instead of: <br />
<code>&gt; docker-machine env default</code><br />
I do this instead, and the script does the rest: <br />
<code>&gt; . dockerEnv</code></p>
{{< /raw_html >}}
<!--more-->
{{< raw_html >}}
<p>The contents of the script are pretty trivial (I am sure shell wizards can find plenty  wrong with it, starting with the direct reference to bash, but whatever. Laziness, right?): </p>

<pre><code>#!/bin/bash
UP=`docker-machine status default`
if [ "$UP" != "Running" ] ; then
    echo "Starting default docker VM"
    docker-machine start default
fi

eval "$(docker-machine env default)"
export DM_IP=$(docker-machine ip default)
echo $DM_IP

DM_SUBNET=192.168.$(echo $DM_IP| cut -d'.' -f 3)
RESULT=`netstat -rn | grep $DM_SUBNET | grep vboxnet`
if [ "$RESULT" = "" ] ; then
    echo "Adding route for vboxnet0"
    sudo route -nv add -net $DM_SUBNET -interface vboxnet0
    RESULT=`netstat -rn | grep $DM_SUBNET | grep vboxnet`
    if [ $RESULT = "" ] ; then
        echo "Quit AnyConnect and re-run this script."
        exit
    fi
fi
docker-machine ls
</code></pre>

<p class="small">[edit on 3 Sept: updated for even better-ness. Laziness rocks.]</p>
{{< /raw_html >}}
