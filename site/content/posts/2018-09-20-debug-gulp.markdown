---
date: "2018-09-20T00:00:00Z"
tags:
- javascript
- gulp
title: Debug gulp
---
A gulp build unhelpfully finished with:

```
(node:12030) UnhandledPromiseRejectionWarning: null
(node:12030) UnhandledPromiseRejectionWarning: Unhandled promise rejection. This error originated either by throwing inside of an async function without a catch block, or by rejecting a promise which was not handled with .catch(). (rejection id: 1)
(node:12030) [DEP0018] DeprecationWarning: Unhandled promise rejections are deprecated. In the future, promise rejections that are not handled will terminate the Node.js process with a non-zero exit code.
```

I needed to change both my gulpfile and my IDE to be able to follow what
was happening.

<!--more-->

I added this rejection handler to my gulpfile first:

```javascript
process.on('unhandledRejection', (reason, p) => {
  console.log('Unhandled Rejection at: Promise', p, ', reason:', reason);
});
```

which netted me this:

```
Unhandled Rejection at: Promise Promise {
  <rejected> null,
  domain:
   Domain {
     domain: null,
     _events: { error: [Object] },
     _eventsCount: 1,
     _maxListeners: undefined,
     members: [] } } reason: null
```

Not much better.

Let's try debugging gulp! How do I do that again?

In VS Code, let's create a debug configuration that is brain-bashingly simple. Add this to launch.json:

```json
  {
    "type": "node",
    "request": "attach",
    "name": "Attach to Remote",
    "address": "127.0.0.1",
    "port": 9229,
    "localRoot": "${workspaceFolder}/resources",
    "remoteRoot": "Absolute path to the remote directory containing the program"
  }
```

Now launch gulp with some options. I'm using `npx` here because I detest `npm install -g`:

```
$ npx -n --inspect-brk gulp build
```

This process will now wait until VS Code attaches. When the debugger attaches, check the "Uncaught Exceptions" box in the breakpoint section of the debug panel.

Press play, and .. there it is. A much clearer picture of what tipped over. I feel so much better.

(Hope this helps, future self)
