---
title: "Iterative development with Quarkus and Svelte, care of Quinoa"
tags:
  - quarkus
  - svelte
  - gameontext
  - pockets
---

Another conference is coming up, and I'm writing another ridiculous frankenstein app for it. 

For this revision, I am going to add a local-only Web UI for a few reasons: 

- This app is still mostly command-line driven, but some configuration options are awkward to set as arguments, and manually editing a config file is ... meh.
- I haven't done any serious front-end UI work in a really long time. The UI for [Game On! Text adventure](https://github.com/gameontext/gameon-webapp) is overdue for an overhaul, it's an Angular 1 app. I know, I know. Don't judge me.

Between one thing and another, I've been doing more TypeScript alongside my Java and because of some collaboration on plugins for [Obsidian.md](https://obsidian.md/), I've been bumping up against Svelte. I'm going to use this little project to actually figure out how Svelte works.

This project will then have: 

- [Quarkus](https://quarkus.io/) as the main CLI driver that will sometimes wait around for awhile while you fuss around with a Web UI.
- [Svelte](https://svelte.dev/) to create a UI that feels nice to use. 
- [Maven](https://maven.apache.org/) for building Java things
- [Node](https://nodejs.org/en/) + [Vite](https://vitejs.dev/) for TypeScript tooling 

On the surface, the above sounds like a big mess, right? I'm installing double the tools, having to do this build in two steps, and then do the fancy dance to get the Node stuff in the right place in the Java stuff, and deal with making native images happy, and... *gross* 🤢.

Thankfully, [Andy Damevin](https://github.com/ia3andy) has already come to provide the rescue I didn't know I would need. He created the [Quinoa extension](https://quarkiverse.github.io/quarkiverse-docs/quarkus-quinoa/dev/index.html), and I am a fan! 🎉

The Quinoa extension manages building and packaging the embedded Web UI with its preferred tools. So the outer Maven build can carry on doing its thing, and the Quinoa extension will invoke the appropriate node scripts to build and package the Web UI, and tuck them in the right place for serving with an uber jar or native binary. Not only that, but it integrates Quarkus dev mode with the web framework's live coding support, which means you just keep coding and the entire web app evolves as you go. Holy cow, it's awesome.

<!--more-->

Some nitty details, notes for future me, that may end up changing a bit as I keep going, but the important parts of setting this up: 

1. Create a Quarkus project if you don't have one (obvious...)
2. Add the Quarkiverse Quinoa extension: `quarkus ext add quinoa` is easiest here.
3. In your Quarkus project, create and navigate to `src/main`
4. Create your front-end with your favorite tooling choices. I used `npm init vite` to create a new `vite` project, named it `webui` and chose `Svelte` as the framework. *et voilà*, a `src/main/webui` folder, ready to go.

For seamless live-coding in dev mode, I needed two things: 

1. In `src/main/resources/application.properties`

    ```properties
    quarkus.quinoa.dev-server.port=5173
    quarkus.quinoa.build-dir=dist
    quarkus.quinoa.ignored-path-prefixes=/config,/favicon.ico
    ```

2. In `src/main/webui/vite.config.ts`:

    ```ts
    server: {
      port: 5173,
      host: '127.0.0.1',
      hmr: {
        // for proxying from quarkus dev
        port: 5173,
        // for testing standalone
        // protocol: 'ws',
        host: '127.0.0.1',
      }
    }
    ```

Andy has done a great job documenting the requirements for different web frameworks, you should be able to get your current favorite working.

Cheers (and well done, Andy)! 🍻