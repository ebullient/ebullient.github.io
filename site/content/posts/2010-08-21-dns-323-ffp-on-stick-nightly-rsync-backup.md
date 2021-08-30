---
aliases:
  - /articles/52/dns-323-ffp-on-stick-nightly-rsync-backup
tags:
  - backup
  - hardware-nas
title: 'DNS-323: FFP on a stick, nightly rsync backup... '
---
{{< raw_html >}}
<p>I have a lot of things working well, gathered from a lot of resources. I tweaked some scripts to make them work better:</p>
<ul>
<li>I created an /ffp/<hostname> directory for my personal scripts.</li>
<li>I have an rsync script that mirrors the ffp installation on the USB stick (/mnt/usb/ffp) to the primary hard drive (/mnt/HD_a2). This means I only have to maintain the USB-copy, but if the USB is not available, I'll still have working stuff on the regular drive.</li>
<li>I have a few (small) scripts that I use for cron jobs, rather than putting it all directly into the cron task: has the advantage of being able to use logger to add syslog messages.</li>
</ul>
{{< /raw_html >}}
<!--more-->
{{< raw_html >}}
<p>Very very simple: ffp-sync.sh for keeping the usb ffp in sync with the copy on the hard drive. I have this as a small, separate, invokable script so that I can run the backup myself if I've made changes and am feeling paranoid/proactive.</p>
<div class="code">#!/ffp/bin/sh

rsync -av --exclude=packages \
  --exclude=var/log \
  --exclude=var/run \
  --delete /mnt/usb/ffp/ /mnt/HD_a2/ffp
</div>

<p>This is the rsync line for the nightly backup from HD_a2 to HD_b2, based on scripts from the forum post(s) and the interwebs (see references below). The only real change here: using logger to get some evidence in the syslog about when backups start/stop.</p>

<div class="code">#!/ffp/bin/sh
export PATH=/ffp/sbin:/ffp/bin:$PATH

mv /ffp/var/log/rsync.last.log /ffp/var/log/rsync.last.log.prev

srcpath=/mnt/HD_a2/
dstpath=/mnt/HD_b2/backup

date=`date "+%Y%m%d"`
mkdir $dstpath/$date

logger Begin backup: $date

# Use rsync to backup content from the $srcpath to $dstpath/$date
# The contents of --link-dest=$dstpath/current are used as a 'base':
# files are hard-linked from that directory unless they've been changed,
# in which case the file is copied $srcpath.
# -ii is used to include detail in the log (which files are linked, which are copied)
/ffp/bin/rsync -avx -ii \
  --exclude=ffp/var/log \
  --exclude=ffp/var/run \
  --exclude=lost+found \
  --link-dest=$dstpath/current $srcpath $dstpath/$date \
> /ffp/var/log/rsync.last.log 2>&1

var=`ls -1A $dstpath/$date | wc -l`
echo $var

if [ $var -ne 0 ]
then
  rm $dstpath/current
  ln -s $date $dstpath/current
fi

logger Backup complete: $date
</div>

<p>
I also made a script (w/ syslog message: I like to be able to look back when things go wrong and know if/when cron jobs were running): </p>

<div class="code">#!/ffp/bin/sh

logger Checking time via sntp
/usr/sbin/sntp -r -P no us.pool.ntp.org
</div>

<p>
All of this is set up with /ffp/etc/fun_plug.local (of course). Having the home directories on the USB stick avoids the issues I was having before with the permissions being reset. I've preserved the authorized scripts, though, and ensure that they're run if/when the usb stick is unavailable at boot.</p>

<div class="code">#!/ffp/bin/sh
PATH=/ffp/sbin:/ffp/bin:/usr/sbin:/sbin:/usr/bin:/bin

# Use ffp busybox instead
mv /bin/busybox /bin/busybox-dns323
ln -s /ffp/bin/busybox /bin/busybox

if [ ! -h /data ]; then
    ln -s /mnt/HD_a2 /data
fi

# if we're running from USB, then make sure home is mounted
if [ -d /mnt/usb/home/root ]; then
    chmod -x /ffp/start/authorize*.sh 2>/dev/null
    grep /home /proc/mounts >/dev/null 2>/dev/null
    if [ $? -ne 0 ]; then
        mount --bind /mnt/usb/home /home
    fi
else
    # If we aren't running from USB, make sure authorize* scripts are executable
    chmod -x /ffp/start/authorize*.sh 2>/dev/null
fi

# update home directories in /etc/passwd (DNS-323 likes to reset them..)
usermod -d /home/xx -g 510 xx

# set timezone
echo 'EST5EDT,M3.2.0,M11.1.0' > /etc/TZ

# change cron jobs
echo "** Update cron jobs"

# This removes firmware cronjobs that interfere with ntpd.
crontab -l | grep -vw '/usr/sbin/daylight' | grep -vw '/usr/sbin/rtc' | grep -vw '/usr/sbin/stime' | crontab -

# Now start custom cron jobs, including the first which checks the date.
echo "0 * * * * /ffp/hostname/checkdate.sh" >> /var/spool/cron/crontabs/root
echo "1 * * * * /ffp/hostname/routerset.pl" >> /var/spool/cron/crontabs/root
echo "2 3 * * * /ffp/hostname/ffp-sync.sh"  >> /var/spool/cron/crontabs/root
echo "5 3 * * * /ffp/hostname/backup.sh"    >> /var/spool/cron/crontabs/root
cat /var/spool/cron/crontabs/root

# force a cronjob update
echo "root" >> /var/spool/cron/crontabs/cron.update
</div>

<p>References:
<ul>
<li><a href="http://forum.dsmg600.info/t2125-DNS-323-Rsync-Time-Machine!.html">Rsync Time Machine (DNS-323 forum)</a> -- source of backup script</li>
<li><a href="http://blog.interlinked.org/tutorials/rsync_time_machine.html">Time Machine for every Unix out there</a></li>
<li><a href="http://forum.dsmg600.info/viewtopic.php?id=1150">Tutorial: Backup Everything from Vol A to Vol B once a night</a></li>

</ul></p>
{{< raw_html >}}
