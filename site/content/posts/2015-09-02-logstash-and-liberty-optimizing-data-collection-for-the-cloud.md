---
aliases:
- /articles/81/logstash-and-liberty-optimizing-data-collection-for-the-cloud
tags:
- microservices
- liberty
- logstash
title: Using Grok filters to parse Liberty Logs
source: html
---

> Note: Originally posted on [IBM DeveloperWorks](https://developer.ibm.com/wasdev/docs/logstash-liberty-optimizing-data-collection-cloud/). Some of this content is old, but the gist is still useful.

Microservice architectures are highly distributed, with services provided by individual processes that are scaled independently. Understanding and maintaining overall system health becomes increasingly difficult as the system grows; it becomes impractical to look at services instance-by-instance. Monitoring systems like nagios help, but what happens when things go wrong? It is not always possible (much less easy) to ssh into any given system. In some environments the filesystem used by any given instance is transient; when the process stops, the filesystem is cleaned up, including all the logs!

The ELK stack (Elasticsearch, Logstash, and Kibana) is a commonly used system for gathering data (both logs and metrics), and allowing that data to be aggregated, analyzed, visualized, and searched in useful ways.

In this post, I'll focus on getting the most out of WAS Liberty logs using logstash. This isn't the only way: the IBM WebSphere Liberty buildpack in Bluemix, for example, uses loggregator (Cloud Foundry) rather than logstash. But I do hope that this gives you some ideas for how to make the logging capabilities in WAS Liberty work for your environment.

## Getting useful information to system streams

When operating on its own, WAS Liberty produces a few different log files by default:

* "console" output is lightly formatted and contains no timestamps. Failure/error messages and System.err are routed to STDERR, while other important messages and System.out, are routed to STDOUT. When run in the background via `server start`, both streams are collected into a `console.log` file.
* `messages.log` also collects System out, System err, as well as a larger subset of messages (including INFO).
* `trace.log` only appears if detailed trace is enabled. It includes output from all enabled log sources, including System.out and System.err.

Having log messages go directly to STDOUT and/or STDERR is a good environment-agnostic practice for microservices (and is also [one of the 12-factors](http://12factor.net/logs)). It is a pretty simple change to get formatted Liberty logs writing to STDOUT. To ensure we don't miss any messages from server bootstrap and startup, we'll do this via a [`bootstrap.properties` file](http://www-01.ibm.com/support/knowledgecenter/SSAW57_8.5.5/com.ibm.websphere.wlp.nd.doc/ae/twlp_inst_bootstrap.html?cp=SSAW57_8.5.5%2F1-3-11-0-2-6) that contains:

```properties
# Write WLP logs to stdout directly
com.ibm.ws.logging.trace.file.name=stdout
```

As you might infer, this re-routes what would go to `trace.log` to STDOUT. Before this change, STDOUT when running Liberty looks something like this:

```console
$ wlp/bin/server run
Launching defaultServer (WebSphere Application Server 8.5.5.6/wlp-1.0.9.cl50620150610-1749) on Java HotSpot(TM) 64-Bit Server VM, version 1.7.0_72-b14 (en_US)
[AUDIT   ] CWWKE0001I: The server defaultServer has been launched.
```

Afterwards, it looks more like (notice the leading timestamp and fixed fields):

```console
$ wlp/bin/server run
Launching defaultServer (WebSphere Application Server 8.5.5.6/wlp-1.0.9.cl50620150610-1749) on Java HotSpot(TM) 64-Bit Server VM, version 1.7.0_72-b14 (en_US)
[8/25/15 12:40:44:479 EDT] 00000001 id=         com.ibm.ws.kernel.launch.internal.FrameworkManager           A CWWKE0001I: The server defaultServer has been launched.
```

In some cases, this might be enough. If you're running Liberty in the foreground in a Docker container, Liberty's formatted log entries would now be spilling out as the Docker container's STDOUT. If the hosting environment does post-processing on that output, you may have nothing left to do.

## Using logstash to post-process logs

However, we can use logstash to process Liberty log output to produce more robust events. How you link logstash and Liberty together will depend on how and where Liberty is running. As a bare minimum useful for testing filters, you can try something like the following:

```console
$ wlp/bin/server run | logstash -f /path/to/logstash.conf
```

You can use the `-e` command line option to define your filters inline, but I'm starting with the configuration file up front because I'll spend the rest of the post adding things to it.

## Changing the output / making sure it works

I'll start with the log-processing equivalent of "Hello World". Edit your logstash.conf file to contain:

```
input {
  stdin {
  }
}
output {
  stdout {
  }
}
```

You get back pretty much exactly what you had before (with a leading message about logstash startup being complete and additional leading logstash timestamps):

```console
$ wlp/bin/server run | logstash -f logstash.conf
Logstash startup completed
2015-08-26T22:23:04.587Z ec2db0f13b8f Launching defaultServer (WebSphere Application Server 8.5.5.6/wlp-1.0.9.cl50620150610-1749) on OpenJDK 64-Bit Server VM, version 1.8.0_45-internal-b14 (en)
2015-08-26T22:23:04.588Z ec2db0f13b8f [8/26/15 22:22:45:918 UTC] 00000001 id=         com.ibm.ws.kernel.launch.internal.FrameworkManager           A CWWKE0001I: The server defaultServer has been launched.
```

This does increase the amount of time it takes before we can see that the server has started properly, as the messages piped through logstash get delayed a bit while logstash starts itself.

## Debugging

Given we're going to start doing crazy things, we'll want to be able to see how we changed what logstash stores for each entry. We'll use the `rubydebug` codec to do this:

```
output {
  stdout {
    codec => rubydebug
  }
  ...
}
```

Once we add that, those first few lines now look like this (please do scroll right):

<pre class="brush: plain; title: ; notranslate" title="">Logstash startup completed
    {
       "message" => "Launching defaultServer (WebSphere Application Server 8.5.5.6/wlp-1.0.9.cl50620150610-1749) on OpenJDK 64-Bit Server VM, version 1.8.0_45-internal-b14 (en)",
      "@version" => "1",
    "@timestamp" => "2015-08-28T12:24:48.542Z",
          "host" => "ec2db0f13b8f"
    }
    {
       "message" => "[8/28/15 12:24:29:777 UTC] 00000001 id=         com.ibm.ws.kernel.launch.internal.FrameworkManager           A CWWKE0001I: The server defaultServer has been launched.",
      "@version" => "1",
    "@timestamp" => "2015-08-28T12:24:48.543Z",
          "host" => "ec2db0f13b8f"
    }
</pre>

## Handle multiple lines

We're going to start adding filters in the next few sections. The first we will add is for multi-line output.

```
input {
  ...
}
filter {
  # Combine lines that do not start with "[" or
  # contain "WebSphere Application Server" with the previous message
  multiline {
    pattern => "(^[)|(WebSphere Application Server)"
    negate => true
    what => "previous"
  }
  ## MORE HERE.
}
output {
  ...
}
```

Note first that the pattern is negated; we're asserting that any line that does not match the pattern is a continuation, and should be lumped together with the previous line.

Liberty log entries (and even wrapped System.out or System.err output) all start with a bracketed timestamp that looks something like, `[8/26/15 22:22:45:918 UTC]`. But, remember that first line of Liberty trace? "Launching defaultServer (WebSphere Application Server 8.5.5.6/wlp-1.0.9.cl50620150610-1749)". Since this is the very first line of output, we have to account for it as a standalone line (go ahead and take it out if you don't believe me... ).

Without logstash (just using raw Liberty), you might see the following output if you use an include to reconfigure your httpEndpoint. Note that the Liberty log timestamp is only on the first line, as this is a multi-line entry that is (further) not a stack trace:

```
[8/28/15 13:10:45:551 UTC] 00000018 id=         com.ibm.ws.config.xml.internal.ConfigValidator               W CWWKG0011W: The configuration validation did not succeed. Found conflicting settings for com.ibm.ws.http[defaultHttpEndpoint] instance of httpEndpoint configuration.
  Property httpPort has conflicting values:
    Value 9081 is set in file:/opt/ibm/wlp/usr/servers/defaultServer/server.xml.
    Value 9080 is set in file:/opt/ibm/wlp/usr/servers/defaultServer/configDropins/overrides/docker.xml.
  Property httpPort will be set to 9080.
  Property httpsPort has conflicting values:
    Value 9444 is set in file:/opt/ibm/wlp/usr/servers/defaultServer/server.xml.
    Value 9443 is set in file:/opt/ibm/wlp/usr/servers/defaultServer/configDropins/overrides/docker.xml.
  Property httpsPort will be set to 9443.
```

Once this filter is applied, things are all properly together as one element. Scroll on and on (and on...) to the right, you'll see all the lines are mashed together in the message separated by `\n` characters:

<pre class="brush: plain; title: ; notranslate" title="">{
       "message" => "[8/28/15 13:07:34:941 UTC] 00000018 id=         com.ibm.ws.config.xml.internal.ConfigValidator               W CWWKG0011W: The configuration validation did not succeed. Found conflicting settings for com.ibm.ws.http[defaultHttpEndpoint] instance of httpEndpoint configuration.\n  Property httpPort has conflicting values:\n    Value 9081 is set in file:/opt/ibm/wlp/usr/servers/defaultServer/server.xml.\n    Value 9080 is set in file:/opt/ibm/wlp/usr/servers/defaultServer/configDropins/overrides/docker.xml.\n  Property httpPort will be set to 9080.\n  Property httpsPort has conflicting values:\n    Value 9444 is set in file:/opt/ibm/wlp/usr/servers/defaultServer/server.xml.\n    Value 9443 is set in file:/opt/ibm/wlp/usr/servers/defaultServer/configDropins/overrides/docker.xml.\n  Property httpsPort will be set to 9443.\n",
      "@version" => "1",
    "@timestamp" => "2015-08-28T13:07:48.991Z",
          "host" => "ec2db0f13b8f",
          "tags" => [
        [0] "multiline"
    ]
}</pre>


## Fill the logstash entry with interesting bits from Liberty trace

Just underneath the multiline filter (we'll keep adding just above the `## MORE HERE` line), we'll add a filter to parse out interesting tidbits from the Liberty log so that we can end up with something useful to trawl through later. This grok filter changes what logstash keeps track of for each entry, and is scary detailed, and is so long it has wrapped. You've been warned.

```
# Overall WLP filter
grok {
  match => [ "message", "(?m)[%{GREEDYDATA:ts}]%{SPACE}%{WORD:threadid}%{SPACE}id=%{BASE16NUM:id}?%{SPACE}%{NOTSPACE:module}%{SPACE}%{WORD:loglevel}%{SPACE}%{GREEDYDATA:message}" ]
  overwrite => [ "message" ]
}
```

This filter removes all of the fixed fields from the beginning of the message, transforming them into logstash entry attributes instead. The elements of the filter:
* `(?m)` -- allows matching across line breaks, which is important when gathering the multi-line payload
* `\[%{GREEDYDATA:ts}\]` -- splices off Liberty's timestamp by matching the brackets and being greedy about the middle, and then stores the timestamp
* `%{SPACE}` -- eats whitespace (used a few times)
* `%{WORD:threadid}` -- stores the thread id
* `id=%{BASE16NUM:id}?` -- stores the associated object id as an attribute (this may or may not have a value, and can be used to group entries that are related to the same instance of some object)
* `%{NOTSPACE:module}` -- stores the name of the Logger
* `%{WORD:loglevel}` -- stores the log level, e.g. O = System.out, R = System.err, E = Error, W = Warning, etc.
* `%{GREEDYDATA:message}` -- replaces the message field with the remainder of the (potentially multi-line) log entry (note that this is possible because of the overwrite directive)

The output after you add this filter has more individual attributes, and a more focused message field, it looks like this:

<pre class="brush: plain; title: ; notranslate" title="">{
       "message" => "CWWKG0011W: The configuration validation did not succeed. Found conflicting settings for com.ibm.ws.http[defaultHttpEndpoint] instance of httpEndpoint configuration.\n  Property httpPort has conflicting values:\n    Value 9081 is set in file:/opt/ibm/wlp/usr/servers/defaultServer/server.xml.\n    Value 9080 is set in file:/opt/ibm/wlp/usr/servers/defaultServer/configDropins/overrides/docker.xml.\n  Property httpPort will be set to 9080.\n  Property httpsPort has conflicting values:\n    Value 9444 is set in file:/opt/ibm/wlp/usr/servers/defaultServer/server.xml.\n    Value 9443 is set in file:/opt/ibm/wlp/usr/servers/defaultServer/configDropins/overrides/docker.xml.\n  Property httpsPort will be set to 9443.\n",
      "@version" => "1",
    "@timestamp" => "2015-08-28T13:27:18.766Z",
          "host" => "ec2db0f13b8f",
          "tags" => [
        [0] "multiline"
    ],
            "ts" => "8/28/15 13:27:04:067 UTC",
      "threadid" => "00000018",
        "module" => "com.ibm.ws.config.xml.internal.ConfigValidator",
      "loglevel" => "W"
}</pre>

## Catching mis-fits

As we mess around, we're bound to mis-parse something. In addition to stdout, we'll add an additional output filter to route badly parsed messages to a file (you might want this in /var/log):

```
output {
  stdout {
    codec => "rubydebug"
  }
  if "_grokparsefailure" in [tags] {
    file { path => "failed_parse_events-%{+YYYY-MM-dd}" }
  }
}
```

And wouldn't you know, we already have one (a parse error, I mean). When you run with that configuration, the file is created, and it contains:

<pre class="brush: plain; title: ; notranslate" title=""># cat failed_parse_events-2015-08-28
    {"message":"Launching defaultServer (WebSphere Application Server 8.5.5.6/wlp-1.0.9.cl50620150610-1749) on OpenJDK 64-Bit Server VM, version 1.8.0_45-internal-b14 (en)","@version":"1","@timestamp":"2015-08-28T02:03:02.118Z","host":"ec2db0f13b8f","tags":["_grokparsefailure"]}
</pre>

Hey! It's that first line that we said wasn't a multi-line entry. The trouble is, it doesn't match the only filter we have defined either. So let's add one:

    # Check for the first line (no parsed timestamp)
    if [ts] !~ /.+/ {
      grok {
        match => [ "message", "(WebSphere Application Server)" ]
        add_tag => ["version"]
        remove_tag => ["_grokparsefailure"]
      }
    }

You can only have one dominant grok filter. If you want to do any subsequent filters, they need to be guarded as this one is. This grok filter will only be attempted if the match failed on the previous grok filter (i.e. the ts field hasn't been set). We then look to see if the WebSphere Application Server string is in there, and if it is, tag it as a "version" entry and remove the "_grokparsefailure" tag, as we have now successfully parsed it. Removing the parse failure tag is the more important of the two, IMO. The result looks like this:

<pre class="brush: plain; title: ; notranslate" title="">{
       "message" => "Launching defaultServer (WebSphere Application Server 8.5.5.6/wlp-1.0.9.cl50620150610-1749) on OpenJDK 64-Bit Server VM, version 1.8.0_45-internal-b14 (en)",
      "@version" => "1",
    "@timestamp" => "2015-08-28T13:38:38.761Z",
          "host" => "ec2db0f13b8f",
          "tags" => [
        [0] "version"
    ]
}</pre>

See? Much nicer, no parse errors, and a potentially useful version tag. Not bad.

## Tag exceptions

To tag exceptions, we'll add this filter (again, continuing to insert into the logstash.conf just abouve the `## MORE HERE.` line):

    # tag exceptions / stack traces
    if [message] =~ /.java:\d/ {
      mutate {
        add_tag => ["exception", "trace"]
      }
    }

If we have a message that has been de-multilined and contains `.java:` followed by a digit, we're going to hazard a good guess that it is a stack trace. This will add some tags for that case (to make searching easier). You can obviously do this to flag/tag other interesting messages as needed.

I hacked my app to throw an exception, and it generated a lot of stuff. But I'll grab one so you can see the single json event that contains the stacktrace in the message:

<pre class="brush: plain; title: ; notranslate" title="">{
       "message" => "SRVE0777E: Exception thrown by application class 'org.apache.cxf.interceptor.AbstractFaultChainInitiatorObserver.onMessage:116'\njava.lang.RuntimeException: org.apache.cxf.interceptor.Fault: A test exception for logstash!\n\tat org.apache.cxf.interceptor.AbstractFaultChainInitiatorObserver.onMessage(AbstractFaultChainInitiatorObserver.java:116)\n\tat org.apache.cxf.phase.PhaseInterceptorChain.doIntercept(PhaseInterceptorChain.java:371)\n\tat org.apache.cxf.transport.ChainInitiationObserver.onMessage(ChainInitiationObserver.java:124)\n\tat org.apache.cxf.transport.http.AbstractHTTPDestination.invoke(AbstractHTTPDestination.java:259)\n\tat com.ibm.ws.jaxrs20.endpoint.AbstractJaxRsWebEndpoint.invoke(AbstractJaxRsWebEndpoint.java:134)\n\tat com.ibm.websphere.jaxrs.server.IBMRestServlet.handleRequest(IBMRestServlet.java:149)\n\tat com.ibm.websphere.jaxrs.server.IBMRestServlet.doGet(IBMRestServlet.java:115)\n\tat javax.servlet.http.HttpServlet.service(HttpServlet.java:687)\n\tat com.ibm.websphere.jaxrs.server.IBMRestServlet.service(IBMRestServlet.java:99)\n\tat com.ibm.ws.webcontainer.servlet.ServletWrapper.service(ServletWrapper.java:1285)\n\tat com.ibm.ws.webcontainer.servlet.ServletWrapper.handleRequest(ServletWrapper.java:776)\n\tat com.ibm.ws.webcontainer.servlet.ServletWrapper.handleRequest(ServletWrapper.java:473)\n\tat com.ibm.ws.webcontainer.filter.WebAppFilterManager.invokeFilters(WebAppFilterManager.java:1143)\n\tat com.ibm.ws.webcontainer.webapp.WebApp.handleRequest(WebApp.java:4865)\n\tat com.ibm.ws.webcontainer31.osgi.webapp.WebApp31.handleRequest(WebApp31.java:502)\n\tat com.ibm.ws.webcontainer.osgi.DynamicVirtualHost$2.handleRequest(DynamicVirtualHost.java:297)\n\tat com.ibm.ws.webcontainer.WebContainer.handleRequest(WebContainer.java:996)\n\tat com.ibm.ws.webcontainer.osgi.DynamicVirtualHost$2.run(DynamicVirtualHost.java:262)\n\tat com.ibm.ws.http.dispatcher.internal.channel.HttpDispatcherLink$TaskWrapper.run(HttpDispatcherLink.java:955)\n\tat java.util.concurrent.ThreadPoolExecutor.runWorker(ThreadPoolExecutor.java:1142)\n\tat java.util.concurrent.ThreadPoolExecutor$Worker.run(ThreadPoolExecutor.java:617)\n\tat java.lang.Thread.run(Thread.java:745)\nCaused by: org.apache.cxf.interceptor.Fault: A test exception for logstash!\n\tat org.apache.cxf.service.invoker.AbstractInvoker.createFault(AbstractInvoker.java:163)\n\tat org.apache.cxf.service.invoker.AbstractInvoker.invoke(AbstractInvoker.java:129)\n\tat com.ibm.ws.jaxrs20.server.LibertyJaxRsInvoker.invoke(LibertyJaxRsInvoker.java:195)\n\tat org.apache.cxf.jaxrs.JAXRSInvoker.invoke(JAXRSInvoker.java:200)\n\tat com.ibm.ws.jaxrs20.server.LibertyJaxRsInvoker.invoke(LibertyJaxRsInvoker.java:366)\n\tat org.apache.cxf.jaxrs.JAXRSInvoker.invoke(JAXRSInvoker.java:99)\n\tat org.apache.cxf.interceptor.ServiceInvokerInterceptor$1.run(ServiceInvokerInterceptor.java:61)\n\tat org.apache.cxf.interceptor.ServiceInvokerInterceptor.handleMessage(ServiceInvokerInterceptor.java:99)\n\tat org.apache.cxf.phase.PhaseInterceptorChain.doIntercept(PhaseInterceptorChain.java:307)\n\t... 20 more\nCaused by: java.lang.RuntimeException: A test exception for logstash!\n\tat net.wasdev.jaxrs.async.ItemsResource.listItems(ItemsResource.java:42)\n\tat sun.reflect.NativeMethodAccessorImpl.invoke0(Native Method)\n\tat sun.reflect.NativeMethodAccessorImpl.invoke(NativeMethodAccessorImpl.java:62)\n\tat sun.reflect.DelegatingMethodAccessorImpl.invoke(DelegatingMethodAccessorImpl.java:43)\n\tat java.lang.reflect.Method.invoke(Method.java:497)\n\tat com.ibm.ws.jaxrs20.cdi.component.JaxRsFactoryBeanCDICustomizer.serviceInvoke(JaxRsFactoryBeanCDICustomizer.java:211)\n\tat com.ibm.ws.jaxrs20.server.LibertyJaxRsServerFactoryBean.performInvocation(LibertyJaxRsServerFactoryBean.java:593)\n\tat com.ibm.ws.jaxrs20.server.LibertyJaxRsInvoker.performInvocation(LibertyJaxRsInvoker.java:114)\n\tat org.apache.cxf.service.invoker.AbstractInvoker.invoke(AbstractInvoker.java:97)\n\t... 27 more\n",
      "@version" => "1",
    "@timestamp" => "2015-08-28T14:59:50.040Z",
          "host" => "ec2db0f13b8f",
          "tags" => [
        [0] "multiline",
        [1] "exception",
        [2] "trace"
    ],
            "ts" => "8/28/15 14:59:49:873 UTC",
      "threadid" => "00000033",
        "module" => "com.ibm.ws.webcontainer.util.ApplicationErrorUtils",
      "loglevel" => "E"
}</pre>

Lots of scrolling to the right will show the de-multi-lined stack trace, but the more interesting aspect is that our filter added the tags we wanted (exception and trace).

## Functional output

The `rubydebug` codec is great for debugging, but probably isn't what you want to push around for a live system. Switching to JSON is as easy as replacing the `rubydebug` codec with `json`. You can also have a few output filters at the same time:

```
output {
  stdout {
    codec => "json"
  }
  file {
    path => "wlp-%{+YYYY-MM-dd}"
  }
  if "_grokparsefailure" in [tags] {
    file { path => "failed_parse_events-%{+YYYY-MM-dd}" }
  }
}
```

The above configuration produces single-line JSON going to STDOUT (lots of scrolling to the right again):

<pre class="brush: plain; title: ; notranslate" title="">{"message":"CWWKF0007I: Feature update started.","@version":"1","@timestamp":"2015-08-28T14:41:33.596Z","host":"ec2db0f13b8f","ts":"8/28/15 14:41:17:230 UTC","threadid":"00000018","module":"com.ibm.ws.kernel.feature.internal.FeatureManager","loglevel":"I"}
{"message":"CWWKG0011W: The configuration validation did not succeed. Found conflicting settings for com.ibm.ws.http[defaultHttpEndpoint] instance of httpEndpoint configuration.\n  Property httpPort has conflicting values:\n    Value 9081 is set in file:/opt/ibm/wlp/usr/servers/defaultServer/server.xml.\n    Value 9080 is set in file:/opt/ibm/wlp/usr/servers/defaultServer/configDropins/overrides/docker.xml.\n  Property httpPort will be set to 9080.\n  Property httpsPort has conflicting values:\n    Value 9444 is set in file:/opt/ibm/wlp/usr/servers/defaultServer/server.xml.\n    Value 9443 is set in file:/opt/ibm/wlp/usr/servers/defaultServer/configDropins/overrides/docker.xml.\n  Property httpsPort will be set to 9443.\n","@version":"1","@timestamp":"2015-08-28T14:41:33.602Z","host":"ec2db0f13b8f","tags":["multiline"],"ts":"8/28/15 14:41:18:774 UTC","threadid":"00000018","module":"com.ibm.ws.config.xml.internal.ConfigValidator","loglevel":"W"}
</pre>

And it *also* produces a file containing the same thing (the default codec for the file filter is "plain" and the default message_format is "json"), which is a handy local backup should some other post-processing step stop working.

# The road goes ever on and on..

There is so much more you can do with logstash, I could probably write a book about it (though I am fairly sure others already have).

When using Docker containers, you could run logstash inside the container, allowing you to manipulate the output before it goes anywhere else. The example configuration I've provided generates a rotating log file in addition to changing stdout from the container, but you could alternately use logstash in the container to write to syslog instead of stdout.

[Logstash and containers](https://denibertovic.com/post/docker-and-logstash-smarter-log-management-for-your-containers/) provides one point of view for how to use logstash with Docker containers, but bear in mind that some Docker hosting environments (like the IBM Container service in Bluemix) would handle the output produced by your container, alleviating some of the concerns around the log data managed by docker.



Some useful links for further reading:

*  [Logstash overview](https://www.elastic.co/guide/en/logstash/current/introduction.html)
    * [filter reference](https://www.elastic.co/guide/en/logstash/current/filter-plugins.html)
    * [grok filter reference](https://www.elastic.co/guide/en/logstash/current/plugins-filters-grok.html)
* [Logstash-forwarder](https://github.com/elastic/logstash-forwarder)