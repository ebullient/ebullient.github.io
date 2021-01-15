---
date: "2016-01-27T00:00:00Z"
aliases:
- /articles/77/swagger-first-api-design
tags:
- microservices
- swagger
- java
- liberty
- gameontext
title: Swagger-first API design
---
{{< raw_html >}}
<p>I've been working for the past few months on building Game On! a microservices-based application that is intended to show both what a microservices architecture looks like, and to make it easy for people to play with such a system without having to start from the ground up themselves.</p>

<p>We started with a best-guess set of services, and over time, it became pretty apparent that our first pass at a map building service (the Concierge) was both misleading in purpose and insufficient in function. It did serve its purpose, filling in for service discovery in a way, but we were growing beyond what the service could do. </p>
{{< /raw_html >}}
<!--more-->
{{< raw_html >}}
<p>I'm more familiar with Java than anything else, so I built the new Map <span class="caps">API</span> using <span class="caps">JAX</span>-RS and Liberty, but I also tried something new. In the beta drivers released in late 2015, Liberty added an <span class="caps">API</span> Discovery feature, which allows automatic generation of Swagger documentation from <span class="caps">JAX</span>-RS and Swagger annotations in the application.</p>

<p>I set up the new Map service using the beta driver and this beta feature, and started creating the skeleton elements that would form the <span class="caps">API</span> in Eclipse with <span class="caps">WDT</span>. As I made changes to the application files, all I had to do was refresh the browser to see an updated view of my <span class="caps">API</span>. </p>

<p><img src="/images/11t.png" title="WAS Liberty API Discovery feature" alt="WAS Liberty API Discovery feature" /></p>

<p>I really liked working this way: I could get a better feel of the usability of the <span class="caps">API</span> because I could see the whole view in one place. It also meant I was building up a useful set of models that I could then use with Jackson to streamline dealing with <span class="caps">JSON</span> payloads.</p>
{{< /raw_html >}}
