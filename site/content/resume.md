---
layout: layouts/page.vto
title: Resume
url: "/resume/"
description: "Resume for Erin Schnabel."
cssclasses:
- cv
- resume
- page
stylesheets:
- https://fonts.googleapis.com/css2?family=IBM+Plex+Serif:ital,wght@0,400;0,600;1,400&family=IBM+Plex+Mono:wght@400;500&display=swap
- /assets/resume.css
preconnect:
- https://fonts.googleapis.com
- https://fonts.gstatic.com
---
<header>
  <h1>
      <div class="title">Erin Schnabel</div>
  </h1>
  <div class="address">Developer Advocate, Architect, Strategist &middot; Java &amp; Open Source</div>
  <div class="contact">
    Wappingers Falls, New York &middot;
    erinschnabel@gmail.com &middot;
    <a href="https://www.linkedin.com/in/erinschnabel">LinkedIn</a> &middot;
    <a href="https://www.ebullient.dev/skills/">Skills</a> &middot;
    <a href="https://www.commonhaus.org">www.commonhaus.org</a>
  </div>
</header>

<article>
  <p>I work primarily in Java with Quarkus and also maintain several open source projects, including a number of Obsidian plugins written in TypeScript. Recent work is highlighted on my <a href="https://www.ebullient.dev/skills/">Skills</a> page and in my GitHub repositories (<a href="https://github.com/ebullient">github.com/ebullient</a>).</p>

  <p>I joined IBM as a software engineer in 1999. I moved to Red Hat in 2020, and returned to IBM in 2025 while keeping my Red Hat role and title.</p>

  <p>I played a central role in launching the Commonhaus Foundation, defining bylaws, policies, and procedures, and building automation to reduce operational overhead.</p>
</article>

<section>
  <h2>Experience</h2>

  <h3>IBM / Red Hat <span class="version">(Red Hat is an IBM subsidiary)</span></h3>

  <div class="position current">
    <p><strong>Senior Technical Staff Member, IBM</strong> &middot; <span class="duration">Jun 2025-Present</span><br/>
    <strong>Distinguished Engineer, Red Hat</strong> &middot; <span class="duration">Jan 2022-Present</span>
    </p>
    <p class="location">Remote</p>
    <p>Individual contributor and cross-organization strategist across IBM and Red Hat: Java runtimes, Cloud Native metrics (Quarkus, Micrometer, MicroProfile Metrics, OpenTelemetry Metrics), Java's intersection with the command line, and AI-assisted development. Drive cross-organization dynamics and strategy, facilitating communication and alignment across organizational boundaries.</p>
    <ul>
      <li>Built Java reference applications exploring agentic development, Quarkus + LangChain4j + Neo4j and Spring + Embabel, contributing upstream to an architectural shift in Embabel toward pluggable runtimes that can support Quarkus and LangChain4j</li>
      <li>Developed a set of GitHub Apps to manage Commonhaus Foundation operations, applying AI-assisted SDLC practices to balance forward progress with code quality and maintainability</li>
      <li>Applied hands-on experience from these applications to emerging PDLC/SDLC tooling and strategy</li>
    </ul>
  </div>

  <div class="position">
    <p><strong>Senior Principal Software Engineer, Red Hat</strong> &middot; <span class="duration">Sep 2020-Jan 2022</span></p>
    <p class="location">Remote</p>
    <p>Individual contributor in the Cloud Native metrics area (Java, Quarkus, Micrometer, MicroProfile Metrics, OpenTelemetry Metrics), with early focus on the intersection of Java and the command line as native-binary compilation became viable.</p>
    <ul>
      <li>Created the Quarkus Micrometer extension</li>
      <li>Re-structured the Quarkus CLI for the Quarkus 2.0 release (consistent command options and arguments, informative help and usage messages, streamlined invocation), which informed the sample apps and demos I built during this time</li>
      <li>Spoke publicly and built sample applications on Quarkus, Micrometer, and metrics/monitoring in cloud environments</li>
      <li>Demonstrated niche technical topics, such as using JPA in a CLI application with Quarkus</li>
    </ul>
  </div>

  <h3>Commonhaus Foundation</h3>

  <div class="position current">
    <p><strong>Council Chairperson</strong> &middot; <span class="duration">Dec 2023-Present</span></p>
    <p class="location"><a href="https://www.commonhaus.org">www.commonhaus.org</a></p>
    <p>Serve as the current Council chairperson for the Commonhaus Foundation.</p>
    <ul>
      <li>Developed the first bylaws and policy drafts for the Commonhaus Foundation using AI-assisted workflows, then iterated them through council and legal review</li>
      <li>Established voting policies and procedures, backed by automation, to streamline consensus-building and organizational decision-making</li>
      <li>Drove the foundation's fiscal sponsorship pipeline end to end, growing supported projects from 15 to 32 (June 2025 to June 2026)</li>
      <li>Secured $105k in funding for FY25-26 (including 30k contributed directly to projects), with HeroDevs as a gold sponsor and IBM and TuxCare as silver sponsors</li>
      <li>Partnered with HeroDevs to launch the Open Source Sustainability Initiative (OSSI)</li>
    </ul>
  </div>

  <h3>IBM <span class="version">(21 years)</span></h3>
  <p class="location">Earlier roles, Poughkeepsie, New York, 1999-2020</p>

  <div class="position">
    <p><strong>STSM, Emerging Application Runtimes and Frameworks</strong> &middot; <span class="duration">Jan 2020-Aug 2020</span></p>
    <p>Worked across Red Hat and IBM development teams on Quarkus and other Kube-native middleware efforts, contributing to the development of next-generation community-sourced runtimes and application frameworks.</p>
  </div>

  <div class="position">
    <p><strong>Senior Technical Staff Member</strong> &middot; <span class="duration">Jun 2017-Jan 2020</span></p>
    <p>Owned Spring @ IBM, establishing first-class support for the Spring ecosystem across IBM technologies (Cloudant, DB2, MQ, Watson) alongside existing Liberty support. Led a team building IBM Cloud application starters (code generation and cloud-service bindings) for both Spring and Liberty. This is also where the Micrometer work started. Using it with Spring surfaced problems with the MicroProfile Metrics spec, which led to the creation of the Quarkus Micrometer extension at Red Hat in 2020.</p>
  </div>

  <div class="position">
    <p><strong>Senior Software Engineer, Microservices Architect</strong> &middot; <span class="duration">May 2015-Jun 2017</span></p>
    <p>Assembled and led a team defining WebSphere's point of view on building cloud-native microservices using Liberty.</p>
    <ul>
      <li>Created the Liberty App Accelerator, improving the developer experience for scaffolding Liberty-based applications; drove usability improvements to Liberty's Maven and Gradle plugins and the WebSphere Development Tools plugin for Eclipse</li>
      <li>Created Game On!, an exemplar microservices text-adventure application that debuted at JavaOne 2016, later became an IBM Architecture Center reference architecture, and is the source material behind the Microservices Best Practices for Java Redbook</li>
    </ul>
  </div>

  <div class="position">
    <p><strong>Senior Software Engineer</strong> &middot; <span class="duration">Dec 2012-May 2015</span></p>
    <p>Co-development lead for WebSphere Application Server Liberty Profile. A continuation of the role below, with the title change reflecting a promotion partway through. Focus: modularity, composability, multicore processing, and high scalability, availability, and throughput. Liberty was later open-sourced as OpenLiberty, a lightweight OSGi-based application server with a simplified configuration system and a composable server runtime for iterative development of JEE Web Profile, OSGi, and MicroProfile applications.</p>
    <ul>
      <li>Built Rosie, a web app (Angular.js, JAX-RS) that replaced manual service-integration checklists with an interactive tool: the negotiated compromise that made Continuous Delivery workable for developers</li>
      <li>Instituted periodic API/SPI compatibility reviews anchored to code changes, with tooling that diffed declared API/SPI/Config metadata between snapshots and fed into build-time compatibility checks</li>
    </ul>
  </div>

  <div class="position">
    <p><strong>Advisory Software Engineer</strong> &middot; <span class="duration">Jun 2005-Dec 2012</span></p>
    <p>Built an OSGi-based runtime kernel (running the WebSphere web container, the Catalina web container, and an experimental PHP container concurrently, with interchangeable HTTP, Thrift, and Protobuf transports) that became the seed of WebSphere Liberty. Provided training as developers moved from WebSphere's imperative model to Liberty's dependency-injection approach.</p>
  </div>

  <div class="position">
    <p><strong>Staff Software Engineer</strong> &middot; <span class="duration">Sep 2001-Jun 2005</span></p>
    <p>Developer: WebSphere Application Server for z/OS, specializing in RMI/IIOP workloads. Area expert on the behavior of RMI/IIOP (Java's RMI protocol for exporting and importing Java objects, combined with the CORBA-specified GIOP/IIOP protocols for well-formatted data streams) and on the OSGi Declarative Services specification.</p>
  </div>

  <div class="position">
    <p><strong>Software Engineer</strong> &middot; <span class="duration">Sep 1999-Sep 2001</span></p>
    <p>Developer and System Test for WebSphere Application Server on z/OS. Worked with a combination of native (C/C++) and Java code, with the interaction between the two languages (and the storage, performance, and other considerations that go with it) playing a critical role.</p>
  </div>
</section>

<section>
  <h2>Education</h2>
  <p><strong>Case Western Reserve University</strong></p>
  <p>BS, Computer Engineering and MS, Computer Science (both 2000)</p>
</section>

<section class="resume-top-skills">
  <h2>Top Skills</h2>
  <div class="skills-grid">
    <p><strong>Languages:</strong> Java, TypeScript, HTML/CSS</p>
    <p><strong>Cloud Native / Microservices:</strong> Quarkus (created the Quarkus Micrometer extension), Micrometer, Prometheus, Docker, Kubernetes</p>
    <p><strong>AI-Assisted Development:</strong> LangChain4j, Embabel, Neo4j</p>
    <p><strong>DevOps:</strong> GitHub Actions, process automation</p>
    <p><strong>Standards:</strong> OSGi (Core and Enterprise Expert Groups), CORBA / RMI-IIOP</p>
    <p><strong>Other:</strong> Public speaking and teaching, mentoring and leadership</p>
  </div>
</section>

<section>
  <h2>Credentials</h2>
  <div class="credentials-grid">
    <div class="credential-col">
      <h3>Honors &amp; Awards</h3>
      <ul>
        <li><strong>Java Champion</strong></li>
        <li><strong>IBM Corporate Award</strong>, IBM, Apr 2014. Awarded for work on the creation and delivery of WebSphere Liberty.</li>
        <li><strong>Outstanding Technical Achievement Award</strong>, IBM, Oct 2017</li>
      </ul>

      <h3>Publications</h3>
      <ul>
        <li><strong>Microservices Best Practices for Java</strong>, IBM Redbooks, Dec 2016, co-authored</li>
        <li><strong>WebSphere Application Server Liberty Profile Guide for Developers</strong>, IBM Redbooks, Oct 2012, co-authored, first edition</li>
      </ul>
    </div>
    <div class="credential-col">
      <h3>Patents</h3>
      <ul>
        <li><strong>Object Request Broker</strong>, US 8,387,070, issued Feb 2013, co-invented</li>
        <li><strong>Pre-population of meta data cache for resolution of data marshaling issues</strong>, US 8,239,877, issued Aug 2012, co-invented</li>
        <li><strong>Distribution of general inter-ORB protocol messages</strong>, US 7,882,506, issued Feb 2011, co-invented</li>
      </ul>
    </div>
  </div>
</section>
