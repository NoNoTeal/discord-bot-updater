# discord-bot-updater

## Usage

```js
var dbu = require('discord-bot-updater');
var doPrereleases = true; //default = true
var doOverwrite = true; //default = true
var posFromLatest = 0; //default = 0 can override doPrereleases if changed
var filter = []; //default = []
dbu.downloadRelease('username', 'reponame', doPrereleases, doOverwrite, posFromLatest, filter = [])
```
## Installation

```
npm i discord-bot-updater
```

## Warnings

Any existing files will be overwritten by the newer release, not merged. (MAY CAUSE CORRUPTION?)

## Changelog

### 1.0.0

Inital release (do not use)

### 1.0.1

Fixed a breaking bug.

### 1.0.2

Removed a line a code

### 1.0.3

Returns an array instead of a boolean, fixes posFromLatest so if it is modified, it will override doPrereleases.

### 1.0.4

Fixes filter bug

### 1.0.5

Connect repo to Github.
Export version-check as well

### 1.0.6

Implement a feature from node-merge-fix so when you overwrite a folder, files can be deleted.
Add some touchups to exported functions.