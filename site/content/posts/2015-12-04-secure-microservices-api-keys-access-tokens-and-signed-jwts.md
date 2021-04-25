---
aliases:
- /articles/80/secure-microservices-api-keys-access-tokens-and-signed-jwts
tags:
- microservices
- liberty
title: 'Secure Microservices: API Keys, Access Tokens, and Signed JWTs'
---

> Note: Originally posted on [IBM developerWorks](https://developer.ibm.com/wasdev/blog/2015/12/04/secure-microservices-api-keys-access-tokens-signed-jwts/). Some of this content is old, but the gist is still useful.

I believe these two things are true:

1. it is very important to secure your microservices
2. it can be difficult to read documentation trying to explain how to secure your microservices

We’ve built three samples for you, which we hope will be easy to read, and will teach you something new.

Using API keys to secure your microservice is Adam’s sample. He explains what API keys are, where they come from, and how they’re used. The sample code is [available on github](https://github.com/WASdev/sample.microservices.security).

Using access tokens to secure microservices is the first of two from Ozzy. He explains how the access tokens created as a result of working with OAuth and OpenID Connect work and are used within a microservices architecture.

Using signed JSON Web Tokens (JWTs) to secure microservices builds on the previous article to explain how to use Signed JWTs to propagate identity instead of access tokens.

Go play!