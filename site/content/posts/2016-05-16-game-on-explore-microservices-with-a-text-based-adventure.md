---
aliases:
  - /articles/78/game-on-explore-microservices-with-a-text-based-adventure
tags:
  - gameontext
  - java
  - liberty
  - microservices
title: Game On! Explore microservices with a text-based adventure
---
Microservices: the buzz is everywhere. Given the breadth of technologies related to the term, it can be difficult to get a full picture of what a microservices architecture should look like, or to understand why it is said that microservices architectures both remove and introduce complexity at the same time. [Game On! Text Adventure](https://gameontext.org) is a throwback text-based adventure built to help you explore microservices concepts.

There are lots of examples of microservices that go something like: type in this code, run this build, push this button, and then poof! you have your service! Others show how to install and configure a multi-process component like etcd or consul. They even sometimes describe how to then add a service to it, and maybe even sometimes how to find the added service. But, in a lot of ways, it all seems out of context. From those examples, I only got a glimpse of one piece at a time. I never got an understanding of how an application built using a collection of interacting microservices really worked.

The premise of Game On! is simple: we provide some core elements and then you create services (one or many) to extend the world. It provides a choose-your-own-adventure approach to learning about microservices. We have walk-throughs that do what many other examples do: follow some steps, push some buttons, and TA-DA! you have a working single service written in Java, JavaScript, or Go.

A difference, however, is that your shiny new service is registered as a part of a larger system right out of the gate. The APIs that your service implements will be called by elements of the long-running composed application. How you choose to play with the next steps (making the service resilient, load-balancing and scaling, dealing with eventual consistency) becomes something that can be explored without having to implement a whole bunch of pieces yourself.

More walk-throughs will be coming over time, with most building on the basic walk-throughs we have now.[ All of the source is available on GitHub](https://github.com/gameontext). We hope you enjoy working with it as much as we enjoyed building it.