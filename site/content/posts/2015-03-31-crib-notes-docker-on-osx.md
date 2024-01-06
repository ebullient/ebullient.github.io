---
aliases:
  - /articles/70/crib-notes-docker-on-osx
tags:
  - docker
  - hardware-mac
  - vpn
title: 'Crib notes: Docker on OSX'
source: html
---
<p>Of course I'm messing with Docker (isn't everyone)? But as most people using OS X are discovering, there are some hiccups. Here are some notes for myself (and perhaps for others) about what is required to make docker work well on OS X: </p>

<ul>
	<li><a href="http://viget.com/extend/how-to-use-docker-on-os-x-the-missing-guide">How to Use Docker on OS X: The Missing Guide</a>
<ul>
	<li>Most helpful (and a simultaneous &#8216;duh' moment) was his reminder: boot2docker is the host image for docker on OS X, so when docker maps ports, it maps them to boot2docker, and not to OS X itself. So there are some extra things that need to be done to make that work. He has lots of useful suggestions.</li>
</ul></li>
</ul>

<ul>
	<li>I also use AnyConnect, which introduces it's own fun, as it likes to rewrite the routing table for giggles. I am thankfully <a href="https://github.com/boot2docker/boot2docker/issues/392#issuecomment-61999567">not the only one with this problem</a>. So there were good things to be gleaned here, too.</li>
</ul>
