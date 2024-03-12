---
title: Switch Between Google Chrome Profiles with Alfred on MacOS
description: Use a simple Applescript to switch between active Google Chrome profile windows using Alfred workflows on MacOS.
tags:
  - scripts
keywords:
  - Alfred
  - osascript
  - Google Chrome
---

I use multiple profiles in Google Chrome to separate my work and personal browsing.

I wanted to be able to switch to a specific profile's window using Alfred.

The Alfred workflow only has two parts:

- A List Filter: Gives me a list of profiles by typable name. The output is a simple string: 'profile Name:window Name'
- A Run Script: Takes the input from the List Filter, splits it into parts, and uses those parts to either find the window or open a new one.

<!--more-->

The Run Script workflow action uses `/usr/bin/osascript` with input as argv to run the following:

```applescript
on run argv
    -- Assuming argv is a list, where the first item is "profileName:windowName"
    set input to item 1 of argv
    set AppleScript's text item delimiters to ":"
    set profileName to text item 1 of input
    set windowName to text item 2 of input
    set AppleScript's text item delimiters to ""

    tell application "Google Chrome"
        set windowList to every window whose name is windowName
        if windowList is not {} then
            set theWindow to first item of windowList
            set index of theWindow to 1
            activate theWindow
        else
            set chromePath to "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
            set profileArg to "--profile-directory=" & quoted form of profileName
            set windowNameArg to "--window-name=" & quoted form of windowName
            set shellCommand to quoted form of chromePath & " " & profileArg & " " & windowNameArg
            do shell script shellCommand
        end if
    end tell
end run
```