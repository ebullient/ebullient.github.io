---
aliases:
  - /articles/19/acpi-on-ibm-t40-with-26-kernel
tags:
  - linux-gentoo
  - hardware-thinkpad
title: ACPI on IBM T40 with 2.6 kernel
source: html
---
<p>OK. getting ACPI to work properly needed to be revisited.</p>

<p><a href="http://bellet.info/laptop/t40.html#suspend_resume">Suspend/Resume on T40</a></p>

<p>This guy originally used APM, but his update on 2004/07/15 makes some good notes, which I followed, notably:</p>
<ul>
<li>Local APIC is required for USB to function properly, but it borks all over suspend/poweroff processing. There is a simple enough referenced patch to make it behave&#8230;</li>
</ul>


<!--more-->
