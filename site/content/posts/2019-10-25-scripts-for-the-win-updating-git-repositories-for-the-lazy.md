---
tags:
  - scripts
  - git
title: Scripts for the win! Updating git repositories for the lazy.
---

I love scripts! I treat them as my extended memory. Blog posts used to do this,
but life and children have eaten up the capacity I used to have for writing.

But I thought I would share my latest script for the lazy (which I have now duplicated several times. I know, I know. WET, DRY. I can't be bothered). This script iterates over all of the git repositories in a sub-directory (where I have several related ones), fetches everything, fast-forwards if it can, and otherwise tries to rebase on the upstream branch if there is one that matches.

There is an extra case statement at the bottom as I inevitably extend this to do
more things specific to this group of projects. This kind of approach grew out
of the scripts written for Game On!, which still work well, and do their extra
duty reminding me what on earth I was doing the last time I worked on it.

<!--more-->

```
#!/bin/bash
script_dir=$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )
orig_dir=${PWD}
cd ${script_dir}

if [ -x /usr/bin/tput ] && [[ `tput colors` != "0" ]]; then
  color_prompt="yes"
elif [ -x /ffp/bin/tput ] && [[ `tput colors` != "0" ]]; then
  color_prompt="yes"
else
  color_prompt=
fi

if [[ "$color_prompt" == "yes" ]]; then
      BLUE="\033[0;34m"
    GREEN="\033[0;32m"
    WHITE="\033[1;37m"
      RED="\033[0;31m"
    YELLOW="\033[0;33m"
  NO_COLOR="\033[0m"
else
        BLUE=""
      GREEN=""
      WHITE=""
        RED=""
  NO_COLOUR=""
fi

note() {
  echo -e "${BLUE}$@${NO_COLOR}"
}

pushd () {
  if ! command pushd "$@" > /dev/null; then
    note "$@ does not exist"
    exit
  fi
}

popd () {
  command popd "$@" > /dev/null
}

update() {
  for x in $(find . -d -maxdepth 1 -mindepth 1 -type d); do
    note "-- $x";
    pushd $x;
    if [ -d .git ]; then
      git fetch --all --prune;
      if git status | grep "fast-forward"
      then
        note "fast-forwarding $x";
        git pull
      fi
      if git remote | grep 'ebullient'; then
        local branch=$(git branch --show-current)
        if git branch -a | grep "remotes/upstream/${branch}"; then
          note "rebasing ebullient fork on upstream/${branch}"
          git rebase upstream/${branch} && git push
        fi
      fi
    fi
    popd
  done
}

#set the action, default to help if none passed.
ACTION=
if [ $# -ge 1 ]; then
  ACTION=$1
  shift
fi

case "${ACTION}" in
  alias)
    echo "alias qk='${script_dir}/qk.sh'"
  ;;
  git)
    update
  ;;
  *)
    update
  ;;
esac
```
