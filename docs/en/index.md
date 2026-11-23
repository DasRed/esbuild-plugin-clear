---
title: Overview
description: esbuild-plugin-clear deletes a folder before every esbuild build so no stale files are left in the output directory. Quick example, behaviour and status.
order: 0
section: Getting started
---

esbuild overwrites its output files but never deletes anything. Rename an entry point or drop a chunk, and the old
files stay in `dist/`. `esbuild-plugin-clear` deletes the folder before every build, so only what the current build
produces is left.

## Quick example

```js
import esbuild from 'esbuild';
import clear from 'esbuild-plugin-clear';

await esbuild.build({
    entryPoints: ['./src/index.js'],
    bundle:      true,
    outfile:     './dist/index.js',
    plugins:     [
        clear('./dist'),
    ],
});
```

## What the plugin does

- It hooks into esbuild's `onStart` and deletes the given folder including its contents, so in watch mode before every
  rebuild.
- If the folder does not exist, nothing happens.
- esbuild creates the folder again when it writes the output.

> [!CAUTION]
> The plugin deletes whatever you pass, without asking and without checks. `clear('.')` deletes your whole project.

## Status

Version 1.0.1, written in 2021. Tested with esbuild 0.28 and Node.js 22.

## Related packages

The three esbuild plugins are meant as a set:

- [esbuild-plugin-copy](https://www.marco-starker.de/en/projects/esbuild-plugin-copy): copies files into the output
  directory after the build.
- [esbuild-plugin-time](https://www.marco-starker.de/en/projects/esbuild-plugin-time): measures how long the build
  takes.
