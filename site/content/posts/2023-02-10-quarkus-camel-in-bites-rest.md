---
title: "Quarkus and Camel in bites: REST endpoints"
tags:
  - quarkus
  - camel
  - rest
---

Learning things a teensy bit at a time. While my ultimate goal is to do pretty much anything other than REST, I still have this nice shiny svelte front-end that needs to pull some things from the co-resident Quarkus app. I could, of course, provide that information in "the usual way", but I'm exploring Camel here, which means I should try doing it that way, instead.

Using Quarkus and Camel together is a bit of a brain-bender, as you're overlapping two environments that are totally independent and overlapping, but it does work, and I can see some glimmers of why, but if you've grown up thinking about things as RestTemplates or JAX-RS resources, it's... very different.

<!--more-->


This is just a snip, and it isn't checked in anywhere, but as a snapshot, it explains what I had to do to get a Rest endpoint functioning (with my own quirks, of course):


```java
package dev.ebullient.pockets.routes;

import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;

import org.apache.camel.builder.RouteBuilder;
import org.apache.camel.model.rest.RestBindingMode;

import dev.ebullient.pockets.config.PocketsConfigProvider.PocketsConfigHolder;
import io.quarkus.arc.WithCaching;

@ApplicationScoped
public class WebUIConfigRoute extends RouteBuilder {

    @Inject
    @WithCaching
    PocketsConfigHolder configHolder;

    @Override
    public void configure() throws Exception {

        restConfiguration()
            .inlineRoutes(true)                                       // 1
            .dataFormatProperty("autoDiscoverObjectMapper", "true")   // 2
            .bindingMode(RestBindingMode.json);                       // 3

        rest("/config")
            .get("current")                                           // 4
                .to("direct:getCurrentConfig");                       // 5
    }

    @Consume("direct:getCurrentConfig")                               // 6
    public PocketsConfig getCurrentConfig() {
        return configHolder.getConfig();                              // 7
    }
}
```

1. Using inline routes creates a direct 1:1 relationship between (5) and (6)
2. This tells Camel to find/detect the Quarkus Jackson ObjectMapper
3. Setting the binding mode ensures we stick with attempting JSON (and not XML) in the absence of a clarifying Accept-Header
4. I'm anticipating a little here, but `/config` is the rest root (`@Path` at the class level), and "current" is equivalent to `@Get @Path("current")`. The full resource path is `/config/current`.
5. Name of the endpoint this REST service will call, specifically, the direct endpoint that will prepare the response (see 6).
6. The Consumes annotation defines the direct route this method will handle ("consume")
7. Return a POJO value (the holder is a CDI client proxy).


p.s. Part of me is sighing. Here we are, on the cusp of Quarkus 3, and I'm adding more things with `javax` packages, because I'm still working against Quarkus 2. Oh well. No rest for the wicked.
