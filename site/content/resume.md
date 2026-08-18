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
- https://fonts.googleapis.com/css2?family=IBM+Plex+Serif:ital,wght@0,400;0,600;1,400&display=swap
- /assets/resume.css
preconnect:
- https://fonts.googleapis.com
- https://fonts.gstatic.com
---
<header>
  <h1>
      <div class="title">Erin Schnabel</div>
  </h1>
  <div class="address">Developer, Architect, Advocate &mdash; Java &amp; Open Source</div>
  <div class="contact">
    Wappingers Falls, New York &middot;
    erinschnabel@gmail.com &middot;
    <a href="https://www.linkedin.com/in/erinschnabel">LinkedIn</a> &middot;
    <a href="/skills/">Skills</a> &middot;
    <a href="https://www.commonhaus.org">Commonhaus Foundation</a>
  </div>
</header>

<article>
  <p>I still work with Java (mostly), primarily with Quarkus. My focus has always been automation and developer experience &mdash; first in Quarkus tooling, and more recently in standing up the Commonhaus Foundation: drafting policy, onboarding projects, finding sponsorships, and building the automation that runs the foundation's machinery. I've also been using AI tooling to help with maintenance and code review, like everyone else.</p>

  <p>I joined IBM as a software engineer in 1999 and have been there ever since, with a stint at Red Hat, an IBM subsidiary.</p>

  <p>I'm involved in some open source projects on the side, including maintaining a number of Obsidian plugins (TypeScript). GitHub is the best way to keep up with those: <a href="https://github.com/ebullient">github.com/ebullient</a>. I am also intermittently active on Mastodon: <a href="https://hachyderm.io/@ebullient">hachyderm.io/@ebullient</a>.</p>
</article>

<section>
  <h2>Experience</h2>

  <h3>IBM / Red Hat <span class="version">(Red Hat is an IBM subsidiary)</span></h3>

  <div class="position current">
    <p><strong>Distinguished Engineer, Red Hat / Senior Technical Staff Member, IBM</strong> &mdash; <span class="duration">Jan 2022&ndash;Present</span></p>
    <p class="location">Wappingers Falls, New York, United States</p>
    <p>Individual contributor and cross-organization strategist across IBM and Red Hat: Java runtimes, Cloud Native metrics (Quarkus, Micrometer, MicroProfile Metrics, OpenTelemetry Metrics), Java's intersection with the command line, and AI-assisted development. Drive cross-organization dynamics and strategy, facilitating communication and alignment across organizational boundaries (cross-pollinator / silo-buster).</p>
    <ul>
      <li>Built Java reference applications exploring agentic development, Quarkus + LangChain4j + Neo4j and Spring + Embabel, contributing upstream to an architectural shift in Embabel toward pluggable runtimes that can support Quarkus and LangChain4j</li>
      <li>Developed a set of GitHub Apps to manage Commonhaus Foundation operations, applying AI-assisted SDLC practices to balance forward progress with code quality and maintainability</li>
      <li>Applied hands-on experience from these applications to emerging PDLC/SDLC tooling and strategy</li>
    </ul>
  </div>

  <div class="position">
    <p><strong>Senior Principal Software Engineer, Red Hat</strong> &mdash; <span class="duration">Sep 2020&ndash;Jan 2022</span></p>
    <p class="location">United States</p>
    <p>Individual contributor in the Cloud Native metrics area (Java, Quarkus, Micrometer, MicroProfile Metrics, OpenTelemetry Metrics), with early focus on the intersection of Java and the command line as native-binary compilation became viable.</p>
    <ul>
      <li>Created the Quarkus Micrometer extension</li>
      <li>Worked on a refactor and cleanup of the Quarkus CLI for the Quarkus 2.0 release, which informed the sample apps and demos below</li>
      <li>Spoke publicly and built sample applications on Quarkus, Micrometer, and metrics/monitoring in cloud environments</li>
      <li>Demonstrated niche technical topics, such as using JPA in a CLI application with Quarkus</li>
    </ul>
  </div>

  <h3>Commonhaus Foundation</h3>

  <div class="position current">
    <p><strong>Council Chairperson</strong> &mdash; <span class="duration">Dec 2023&ndash;Present</span></p>
    <p class="location"><a href="https://www.commonhaus.org/">commonhaus.org</a></p>
    <p>Serve as the current Council chairperson for the newly launched Commonhaus Foundation.</p>
    <ul>
      <li>Drove the foundation's fiscal sponsorship pipeline end to end, growing supported projects from 15 to 32 (June 2025 to June 2026)</li>
      <li>Negotiated and secured $105k in funding for FY25&ndash;26 ($30k from IBM, $75k from other corporate sponsors), including a multi-month negotiation with HeroDevs (proposal review, contract terms) that led to the creation of the OSSI initiative; routed $30k of sponsor funds directly to supported projects</li>
    </ul>
  </div>

  <h3>IBM <span class="version">(21 years)</span></h3>
  <p class="location">Earlier roles, 1999&ndash;2020</p>

  <div class="position">
    <p><strong>STSM, Emerging Application Runtimes and Frameworks</strong> &mdash; <span class="duration">Jan 2020&ndash;Aug 2020</span></p>
    <p class="location">Poughkeepsie, New York, United States</p>
    <p>Worked across Red Hat and IBM development teams on Quarkus and other Kube-native middleware efforts, contributing to the development of next-generation community-sourced runtimes and application frameworks.</p>
  </div>

  <div class="position">
    <p><strong>Senior Technical Staff Member</strong> &mdash; <span class="duration">Jun 2017&ndash;Jan 2020</span></p>
    <p class="location">Poughkeepsie, NY</p>
    <p>Java Architect and Developer Advocate, IBM Cloud Developer Services. WAS Liberty architect/maven/evangelist and Microservices Architect.</p>
  </div>

  <div class="position">
    <p><strong>Senior Software Engineer</strong> &mdash; <span class="duration">May 2015&ndash;Jun 2017</span></p>
    <p class="location">Poughkeepsie, NY</p>
    <p>Focused on the design and architecture of WAS Liberty, specifically on how it behaved in large, distributed topologies to ensure its continued growth and role as an essential runtime for building Java-based microservices.</p>
  </div>

  <div class="position">
    <p><strong>Senior Software Engineer</strong> &mdash; <span class="duration">Dec 2012&ndash;May 2015</span></p>
    <p class="location">Poughkeepsie, NY</p>
    <p>Development Lead for WebSphere Application Server Liberty Profile (with Alasdair Nottingham). A continuation of the role below, with the title change reflecting a promotion partway through. Focus: modularity, composability, multicore processing, and high scalability, availability, and throughput. Liberty was later open-sourced as OpenLiberty, a lightweight OSGi-based application server with a simplified configuration system and a composable server runtime for iterative development of JEE Web Profile, OSGi, and MicroProfile applications.</p>
  </div>

  <div class="position">
    <p><strong>Advisory Software Engineer</strong> &mdash; <span class="duration">Jun 2005&ndash;Dec 2012</span></p>
    <p>Development Lead for WebSphere Application Server Liberty Profile (with Alasdair Nottingham). Same focus as above: modularity, composability, multicore processing, and high scalability, availability, and throughput, across the full 7-year span of this role.</p>
  </div>

  <div class="position">
    <p><strong>Staff Software Engineer</strong> &mdash; <span class="duration">Sep 2001&ndash;Jun 2005</span></p>
    <p>Developer: WebSphere Application Server for z/OS, specializing in RMI/IIOP workloads. Area expert on the behavior of RMI/IIOP (Java's RMI protocol for exporting and importing Java objects, combined with the CORBA-specified GIOP/IIOP protocols for well-formatted data streams) and on the OSGi Declarative Services specification.</p>
  </div>

  <div class="position">
    <p><strong>Software Engineer</strong> &mdash; <span class="duration">Sep 1999&ndash;Sep 2001</span></p>
    <p>Developer and System Test for WebSphere Application Server on z/OS. Worked with a combination of native (C/C++) and Java code, with the interaction between the two languages (and the storage, performance, and other considerations that go with it) playing a critical role.</p>
  </div>
</section>

<section>
  <h2>Education</h2>
  <p><strong>Case Western Reserve University</strong> &mdash; <span class="duration">1994&ndash;2000</span></p>
  <p>BS/MS, Computer Science</p>
</section>

<section>
  <h2>Top Skills</h2>
  <div class="skills-grid">
    <p><strong>Languages:</strong> Java, TypeScript</p>
    <p><strong>Cloud Native / Microservices:</strong> Quarkus (created the Quarkus Micrometer extension), Micrometer, Prometheus, Docker, Kubernetes</p>
    <p><strong>DevOps:</strong> GitHub Actions, process automation (automation of any kind)</p>
    <p><strong>Standards:</strong> OSGi (Core and Enterprise Expert Groups), CORBA / RMI-IIOP</p>
    <p><strong>Other:</strong> Public speaking and teaching, mentoring and leadership</p>
    <p><strong>Spoken Language:</strong> English (native speaker)</p>
  </div>
</section>

<section>
  <h2>Credentials</h2>
  <div class="credentials-grid">
    <div class="credential-col">
      <h3>Honors &amp; Awards</h3>
      <ul>
        <li><strong>Java Champion</strong></li>
        <li><strong>IBM Corporate Award</strong> &mdash; IBM, Apr 2014. Awarded for work on the creation and delivery of WebSphere Liberty.</li>
        <li><strong>Outstanding Technical Achievement Award</strong> &mdash; IBM, Oct 2017</li>
      </ul>

      <h3>Publications</h3>
      <ul>
        <li><strong>Microservices Best Practices for Java</strong> &mdash; IBM Redbooks, Dec 2016, co-authored</li>
        <li><strong>WebSphere Application Server Liberty Profile Guide for Developers</strong> &mdash; IBM Redbooks, Oct 2012, co-authored, first edition</li>
      </ul>
    </div>
    <div class="credential-col">
      <h3>Patents</h3>
      <ul>
        <li><strong>Object Request Broker</strong> &mdash; US 8,387,070, issued Feb 2013, co-invented</li>
        <li><strong>Pre-population of meta data cache for resolution of data marshaling issues</strong> &mdash; US 8,239,877, issued Aug 2012, co-invented</li>
        <li><strong>Distribution of general inter-ORB protocol messages</strong> &mdash; US 7,882,506, issued Feb 2011, co-invented</li>
      </ul>
    </div>
  </div>
</section>
