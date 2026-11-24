---
title: Overview
description: esbuild-plugin-clear deletes the output folder before every esbuild build so no stale files are left behind. Quick example, behaviour, safety checks and status.
order: 0
section: Getting started
---

esbuild overwrites its output files but never deletes anything. Rename an entry point or drop a chunk, and the old
files stay in `dist/`. `esbuild-plugin-clear` deletes the output folder before every build, so only what the current
build produces is left.

## Quick example

```js
import esbuild from 'esbuild';
import clear from 'esbuild-plugin-clear';

await esbuild.build({
    entryPoints: ['./src/index.js'],
    bundle:      true,
    outfile:     './dist/index.js',
    plugins:     [
        clear(),
    ],
});
```

Without a path the plugin clears the output folder of the build, here `dist/`.

## What the plugin does

- It hooks into esbuild's `onStart` and deletes the folder including its contents, so in watch mode before every
  rebuild.
- Without a path it takes `outdir`, or the folder of `outfile`.
- Paths are resolved relative to `absWorkingDir` of the build, or the current folder if it is not set.
- If the folder does not exist, nothing happens. esbuild creates it again when it writes the output.

## Safety checks

The plugin never deletes the working directory or one of its parents, so `clear('.')` fails the build instead of
deleting your project. Paths outside the working directory are refused as well, unless you allow them explicitly.
Details are listed under [Options](options.md#safety-checks).

## Status

Version 2, rewritten in TypeScript in 2026. Ships as ESM and CommonJS with type definitions. Tested with esbuild 0.28
and Node.js 22 and 26. Coming from version 1? See [Migration](migration.md).

## Related packages

The three esbuild plugins are meant as a set:

- [esbuild-plugin-copy](https://www.marco-starker.de/en/projects/esbuild-plugin-copy): copies files into the output
  directory after the build.
- [esbuild-plugin-time](https://www.marco-starker.de/en/projects/esbuild-plugin-time): measures how long the build
  takes.
