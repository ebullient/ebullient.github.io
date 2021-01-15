---
date: "2007-01-05T00:00:00Z"
aliases:
- /articles/26/gentoo-and-an-ibm-t60p-part-3-networking
tags:
- gentoo
- thinkpad
title: 'Gentoo and an IBM T60p - Part 3: Networking'
---
{{< raw_html >}}
	<p>Getting networking up and running on the T60p has been a mixed bag. On one hand, the wired connection was easy (expected). The wireless was at first <span class="caps">REALLY</span> flaky, then after some fiddling the connection at home (<span class="caps">WEP</span>) was functional, and as of now (when I'm finally posting this thing) it still doesn't work at work (<span class="caps">LEAP</span>). </p>
{{< /raw_html >}}
<!--more-->
{{< raw_html >}}
	<h3>Wired connection</h3>

	<p>I set the wired connection (using e1000 module) up with netplug so that it will figure out when the cable is and isn't there – it has the added bonus of scheduling net-dependent services at startup.</p>

	<ul>
		<li>sys-apps/netplug-1.2.9-r3</li>
	</ul>

	<h3>Wireless</h3>

	<p>For whatever reason, this laptop does not have an Intel wireless chipset. The Atheros AR5212<sup id="fnrev11129864324fd685eb57840" class="footnote"><a href="#fn11129864324fd685eb57840">1</a></sup> that it does have requires the <code>madwifi</code> driver. </p>

	<p>I also need <span class="caps">WEP</span> and <span class="caps">LEAP</span>, so I use wpa_supplicant as well.</p>

	<ul>
		<li>net-wireless/wireless-tools-28</li>
		<li>net-wireless/ieee80211-1.1.13-r1</li>
		<li>net-wireless/madwifi-ng-0.9.2.1</li>
		<li>net-wireless/madwifi-ng-tools-0.9.2</li>
		<li>net-wireless/wpa_supplicant-0.5.4</li>
	</ul>

	<p>At first, wpa_supplicant would drop the connection after a few minutes. I couldn't find anything conclusive about why this was happening, but the one thing I did find suggested using the generic interface (wext) with wpa_supplicant rather than madwifi<sup id="fnrev8827124634fd685eb57f89" class="footnote"><a href="#fn8827124634fd685eb57f89">2</a></sup>. No change.</p>

	<p>When at home using <span class="caps">WPA</span>, the connection cycled frequently (sometimes as frequently as once every 4 or 5 minutes). When at work trying to use <span class="caps">LEAP</span>, it wouldn't correctly establish a connection at all. :sigh:</p>

	<p>I think I was suffering from a known bug<sup id="fnrev18397749934fd685eb583ab" class="footnote"><a href="#fn18397749934fd685eb583ab">3</a></sup>, so I created some new ebuilds for the 1605 version of madwifi-ng. That seems to have improved the resilience of the connection considerably. </p>

	<p>I <strong>still</strong> am having trouble with rotating through connections and associating via <span class="caps">LEAP</span> at work. I have been using ap_scan=2 because of hidden <span class="caps">SSID</span>s in the office, the problem is that this forces profiles to be tried in order, and when wpa_cli fails on the first one, it seems not to automagically roll over to the next (which previous versions of wpa_supplicant did just fine.. )</p>

	<p>I've found some evidence<sup id="fnrev13878314054fd685eb5893f" class="footnote"><a href="#fn13878314054fd685eb5893f">4</a></sup> suggesting that ap_scan=2 won't work because madwifi-ng doesn't support it. Lovely. But! There is hope<sup id="fnrev5177507454fd685eb58989" class="footnote"><a href="#fn5177507454fd685eb58989">5</a></sup> a patch was added to the madwifi driver at a later level than the one I had to revert to.  </p>

	<p>I haven't retried wireless at work recently. I'll post more when I do.</p>

	<p>— <em>update 2007 Jan 5: madwifi-ng-0.9.2.1 should also include the association fix&#8230; I am now using madwifi-ng-0.9.2.1 (r1842), and that seems to work as well.</em></p>

	<h3>Footnotes / References :</h3>

	<p id="fn11129864324fd685eb57840" class="footnote"><sup>1</sup> <a href="http://www.gentoo-wiki.com/HARDWARE_ar5212"><span class="caps">HARDWARE</span> (Atheros) ar5212</a> <span class="attribute">[<a href="http://gentoo-wiki.com/">gentoo-wiki.com</a>]</span></p>

	<p id="fn8827124634fd685eb57f89" class="footnote"><sup>2</sup> <a href="http://lists.shmoo.com/pipermail/hostap/2006-June/013430.html">wpa_supplicant + madwifi + hidden <span class="caps">SSID</span></a></p>

	<p id="fn18397749934fd685eb583ab" class="footnote"><sup>3</sup> <a href="http://madwifi.org/ticket/973">ThinkPad Z60t: moving from r1543 to r1757 madwifi stops working at all</a></p>

	<p id="fn13878314054fd685eb5893f" class="footnote"><sup>4</sup> <a href="http://lists.shmoo.com/pipermail/hostap/2005-March/009669.html">ap_scan=2 problem?</a></p>

	<p id="fn5177507454fd685eb58989" class="footnote"><sup>5</sup> <a href="http://madwifi.org/ticket/275">Scan for non-<span class="caps">ESSID</span>-broadcasting access point always fails</a></p>

	<h3>Other References (of course):</h3>

	<ul>
		<li><a href="http://madwifi.org/wiki/UserDocs">MadWifi User Docs</a> <span class="attribute">[<a href="http://madwifi.org">madwifi.org</a>]</span></li>
		<li><a href="http://www.thinkwiki.org/wiki/Installing_Ubuntu_6.06_Flight_6_on_a_ThinkPad_X60s">Ubunto on X60s</a> — ndiswrapper for Atheros</li>
	</ul>
{{< /raw_html >}}
