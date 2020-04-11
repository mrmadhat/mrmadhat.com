---
slug: terminal-cheatsheet
date: '2019-03-01'
title: 'Terminal Cheatsheet'
description: 'Interesting snippets I want to remember.'
categories: ['terminal']
redirects:
  - '/terminal/terminal-cheatsheet'
---

Interesting snippets I want to remember

## Set default directory when ssh'ing into a server

[Set default directory when ssh'ing into a server](https://serverfault.com/questions/499565/change-default-directory-when-i-ssh-to-server):
Add cd /dir/to/start/in to .bashrc on the server

[Merge one directory into another](https://unix.stackexchange.com/questions/149965/how-to-copy-merge-two-directories):
`rsync -a /src/ /destination/`

Search for occurrences of a string in a directory and it's sub directories but
only output the filename, useful if the string you're searching for is found in
a log because it will prevent the string being output a gazillion times:
`grep -rl "string to search for" ./dir/to/search`

Quickly check if you have opened a php tag like `<?`:
`grep -rn '.' -e '<?' | sed '/<?php/d' | grep '.php'`

## WHM Specific

The following are specific to servers running whm.

Show what sites are using a specific php version:

```
whmapi1 php_get_vhosts_by_version version=ea-php56
```
