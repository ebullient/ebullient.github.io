---
aliases:
- /articles/82/don-t-wait-build-responsive-applications-with-java-ee-7-instead
tags:
- liberty
- java-ee
title: Don't Wait! Play with Async EE7 instead
---

> Note: Originally posted on [IBM DeveloperWorks](https://developer.ibm.com/wasdev/blog/2015/08/21/dont-wait-build-responsive-applications-java-ee7-liberty/). Some of this content is old, but the gist is still useful.

Java EE 7 introduced additional support for asynchronous request processing over and above the asynchronous servlets and EJBs that were provided in Java EE 6. Java EE 7 includes support for WebSockets, non-blocking I/O in Servlet 3.1, asynchronous processing in JAX-RS 2.0, and Concurrency Utilities for container-supported multi-threading. All of these capabilities have a role to play in making new flavors of applications and application architectures more responsive and efficient.

## Responsive applications to improve the user experience

Consider single page applications (SPA). JavaScript is loaded and run on the client-side as a long-running process (for as long as that browser window/tab, or mobile phone application is active). If you’ve used Gmail or Facebook, or have done some shopping at Amazon, you know what an SPA looks and feels like. When working with an SPA, the user no longer experiences a full page refresh: event-driven, partial page updates are the norm in this environment.

An SPA client generates multiple separate requests to the back-end server to populate different areas of the page. From a user experience point of view, this is great! No blank pages of doom! No tapping of fingers waiting for something to load before you give up and go do something else. Things are a little different when looking at what happens to the supporting infrastructure.

## Handling connections to responsive applications

If the application happens to have frequent updates with small payloads, connection management can become a real problem. The metadata for the HTTP request alone can dwarf the size of the payload it needs to carry, never mind the cost of establishing connections, dealing with proxies, or performing SSL handshakes. There are some connection management tricks that can be played to reduce the overhead, but there is a trade-off in complexity, especially if you want data to be able to flow both ways.

Using WebSockets upgrades an established HTTP connection into a persistent connection that allows for efficient two-way communication between the client and the server. This eliminates the overhead and complexity of managing multiple connections to achieve the same end. Chat applications everywhere, rejoice!

What happens if the application is running on an under-powered client, or on a client on a slow network? Non-blocking I/O support introduced in Servlet 3.1 allows the server-side application to define handlers that can be used to read or write the next chunk of data when the opposite end of the connection is finally ready to provide or receive it. In the meanwhile, the server-side application can happily be handling other requests.

## Asynchronous support in JAX-RS 2.0

What I think will get the most attention and use is async support in JAX-RS 2.0, mostly because HTTP/REST is such a commonly used protocol. Using the @Suspended annotation allows the association between the inbound connection and the request-processing thread to be broken (suspended). That association can then be resumed later to send the response. When combined with either Asynchronous EJBs (of the lite variety) or Concurrency Utilities (to help with context propagation), there is a lot more flexibility with how work is processed on the server-side.

I put together a collection of samples to show what these technologies look like in use. They are small and simple and have their origins in my IBM Interconnect session from February 2015. They are progressive in nature, beginning usually with the pre-Java EE 7 status quo, and then stepping through using the technology and, in some cases, showing some alternate usage patterns.

I hope you find them useful, feedback is welcome!

* WebSockets: [WASdev/sample.async.websockets](https://github.com/WASdev/sample.async.websockets)
* Servlet Non-blocking I/O: [WASdev/sample.async.servletnio](https://github.com/WASdev/sample.async.servletnio)
* Async support in JAX-RS 2.0: [WASdev/sample.async.jaxrs](https://github.com/WASdev/sample.async.jaxrs)