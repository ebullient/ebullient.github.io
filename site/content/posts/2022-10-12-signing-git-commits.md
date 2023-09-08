---
title: "Signing git commits"
tags:
  - command-line
  - git
---
Color me inspired by Kelsey Hightower's talk at the Craft Conference this year, I've decided to do that basic thing and start signing my commits. There were some helpful articles out in the etherverse for how to do that, but they didn't work for me, so I'm sharing what did.

I wanted to use my SSH key to sign my commits. I only commit code from a few places, and I already use SSH for github access, so this seemed the least invasive approach to attempt. That said, I use specific keys for github, and generally don't use the ssh-agent, which means a few things functioned a little differently than most of the walkthroughs showed.

<!--more-->

The key for me was in the git docs, specifically: 

> **`user.signingKey`**
> 
> If [git-tag[1]](https://git-scm.com/docs/git-tag) or [git-commit[1]](https://git-scm.com/docs/git-commit) is not selecting the key you want it to automatically when creating a signed tag or commit, you can override the default selection with this variable. This option is passed unchanged to gpg’s --local-user parameter, so you may specify a key using any method that gpg supports. **If `gpg.format` is set to `ssh` this can contain the path to either your private ssh key or the public key when ssh-agent is used**. Alternatively it can contain a public key prefixed with `key::` directly (e.g.: "key::ssh-rsa XXXXXX identifier"). The private key needs to be available via ssh-agent. If not set git will call gpg.ssh.defaultKeyCommand (e.g.: "ssh-add -L") and try to use the first key available. For backward compatibility, a raw key which begins with "ssh-", such as "ssh-rsa XXXXXX identifier", is treated as "key::ssh-rsa XXXXXX identifier", but this form is deprecated; use the `key::` form instead.
> 
> https://git-scm.com/docs/git-config#Documentation/git-config.txt-usersigningKey

This was my "ah-ha" moment. 
The usual ssh instructions didn't work because they were relying on using a key known to the ssh-agent. 
I set the path to the private key as the `user.signingkey` value, and the rest fell into place.

```shell
> git config --global commit.gpgsign true
> git config --global gpg.format ssh
> git config --global gpg.ssh.allowedSignersFile ~/.ssh/allowed_signers
> git config --global user.signingkey ~/.ssh/github_rsa
```

The inspiration to try this:

{{< youtube Zq1B18nPeHo >}}

**References**:
- [Signing Git Commits with Your SSH Key](https://calebhearth.com/sign-git-with-ssh)
- [How to Sign git Commits with an SSH key - The New Stack](https://thenewstack.io/how-to-sign-git-commits-with-an-ssh-key/)
- [SSH signing keys - GitHub Docs](https://docs.github.com/en/rest/users/ssh-signing-keys)