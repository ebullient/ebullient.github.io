---
date: "2010-05-16T00:00:00Z"
aliases:
- /articles/51/dns-323-finally-back-to-it-sshbusybox
tags:
- backup
- nas
title: 'DNS-323: Finally back to it (SSH/busybox)'
---
{{< raw_html >}}
<p>After a long hiatus, I'm back to trying to finish customizing our NAS; life with kid means your extra time doesn't always get spent the way you'd like, and I've migrated to a new laptop running ubuntu en route, I should write about that, too.
</p>
{{< /raw_html >}}
<!--more-->
{{< raw_html >}}
<p>Reviewed the <a href="http://wiki.dns323.info/howto:ffp#version_0.5">howto</a> again, to see where I left off, which was pretty much right where I finished writing the last entry.</p>

<h3>Setting up SSH</h3>

<p>Setting up SSH was fairly straight-forward. I did have to set up a script to copy the authorized_keys file for the root user to a directory in the flash memory (to ensure that I can log in with my ssh key across a reboot). I opted to create an authorize.sh script in /ffp/start, as described in <a href="http://forum.dsmg600.info/viewtopic.php?id=1630">this forum post</a>.</p>

<p>I also want to log in as a non-root user, and logging in with a public key (without a password) didn't seem to work unless the home directory for my user was also in flash memory (instead of on the mouted volume. So I created another script for "regular" users that I can use to set up more than one user: i.e. an account for me, one for the hubby (whenever he gets around to wanting one), etc. Here it is (/ffp/start/authorize-user.sh): </p>

<pre><code>#!/bin/sh

create_dir() {
    export USER_HOME="/mnt/HD_a2/users/$1"
    export NEW_HOME="/home/$1"
    export NEW_CHOWN="$1:$2"

    echo "USER = $1:$2, HOME = $USER_HOME, NEW = $NEW_HOME"
    if [ -d $USER_HOME ]; then
        if [ ! -d "$NEW_HOME" ]; then
            mkdir $NEW_HOME
            chown $1:$2 $NEW_HOME
            echo "directory created: `ls -ald $NEW_HOME`"
        fi

        if [ -x "$USER_HOME/.setup_home" ]; then
            echo "* /mnt/HD_a2/users/$1/.setup_home ..."
            /mnt/HD_a2/users/$1/.setup_home
        elif [ -d "$USER_HOME/.ssh" ]; then
            cp -Rpv $USER_HOME/.ssh $NEW_HOME
        fi
    fi
}

# One line per user to copy:
create_dir  "myuser"  "defaultGroup"

echo "done."
</code></pre>

<p>And that's it. Works fairly well: at the minimum, it copies the .ssh directory, which is required for ssh key-based login.  For me, since I have to be fancy about things, I can put a .setup_home file (executable) in the home directory on the shared volume to give more direction about what should be copied and how. It "appears to function", but I haven't had the <a href="http://forum.dsmg600.info/viewtopic.php?id=135">permissions reset after a reboot</a> (yet). So we'll see if that still happens.  I have a USB thumbdrive I intend to move ffp to, if I have issues with permissions problems, I may just move the home directories there so I can skip these copy steps altogether.</p>

<h3>Replacing busybox</h3>

<p>The howto mentioned updating the root busybox. I set the default path to put /ffp/bin first, but I also updated the link to busybox in the root /bin file in /ffp/etc/fun_plug.local:

<pre><code>#!/ffp/bin/sh
PATH=/ffp/sbin:/ffp/bin:/usr/sbin:/sbin:/usr/bin:/bin

# Use ffp busybox instead
mv /bin/busybox /bin/busybox-dns323
ln -s /ffp/bin/busybox /bin/busybox
</code></pre>

<p>lighttpd and php next... </p>

<p><i>UPDATE - 6 Jun 2010: Holy hell, batman: when I originally wrote this, I totally typed SSL instead of SSH. WTF?!</i></p>
{{< raw_html >}}
