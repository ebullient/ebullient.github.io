---
aliases:
- /articles/83/building-portable-12-factor-microservices-with-was-liberty-and-bluemix
tags:
- microservices
- liberty
title: Building portable, 12-factor microservices with WAS Liberty and Bluemix
---

> Note: Originally posted on [IBM DeveloperWorks](https://developer.ibm.com/wasdev/blog/2015/08/12/building-portable-12-factor-microservices-with-was-liberty-and-bluemix/). Some of this content is old, but the gist is still useful.

The microservices approach for building (or decomposing) complex applications has received a lot of attention because it can bring so many benefits. Small teams work independently on different parts of the application, moving their standalone piece from development to production at their own pace via a devOps/self-service deployment infrastructure.

The key to this application structure is what each piece, each service, does. The phrase “high cohesion and low coupling” strongly applies: each service should do/own/manage whatever is necessary to provide a useful function. Services in this model are not necessarily small, but they are self-contained and can be updated independently.

Microservices applications are built and oriented around decoupled, independent services. This approach is a specific variant of SOA, one that eschews mediating ESBs in favor of smart endpoints that make their own decisions about how to interact with target services.

These independent services are managed in a significantly different way than traditional enterprise applications. Services are made available via collections of individual, transient service instances. The number of instances will vary based on load.

Service upgrades are performed via blue/green (or red/black) deployments: new versions are deployed side-by-side with old versions, with old versions gradually being removed as clients of the service begin using the new version. This is a rip-and-replace upgrade process, where deployed services are replaced with a newer version rather than migrated.

Given all of this, are there best practices for creating microservices? The [Twelve-factor application](https://12factor.net/) methodology is one frequently referenced approach. It defines factors that services should follow to build portable, resilient applications for cloud environments (SaaS). To quote, 12-factor applications:

> Use **declarative** formats for setup automation, to minimize time and cost for new developers joining the project;
> Have a **clean contract** with the underlying operating system, offering **maximum portability** between execution environments;
> Are suitable for **deployment** on modern **cloud platforms**, obviating the need for servers and systems administration;
> **Minimize divergence** between development and production, enabling **continuous deployment** for maximum agility;
> And can **scale up** without significant changes to tooling, architecture, or development practices.

All of the 12 factors can be satisfied by a Java EE 7 application running on WAS Liberty: some factors are specific to how the application is built, some are based on how the supporting server is configured, and some are aspects of the surrounding environment. 

If you want to know more about microservices, 12-factor apps, or Java EE 7, we have you covered. Check out the following:

* [Microservices Architecture](https://martinfowler.com/articles/microservices.html) (Martin Fowler, martinfowler.com)
* [Microservices: From Theory to Practice. Creating Applications in Bluemix Using the Microservices Approach](https://www.redbooks.ibm.com/redpieces/abstracts/sg248275.html?Open) (IBM Redbook)
* [The 12-factor application](https://12factor.net/) (Adam Wiggins, 12factor.net)