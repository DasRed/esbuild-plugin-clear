---
title: Usage
description: Typical uses of esbuild-plugin-clear – clearing the output folder, watch mode, several builds and combining it with copy.
order: 20
slug: usage
section: Getting started
---

## Clear the output folder before the build

Pass the folder esbuild writes to:

```js
import esbuild from 'esbuild';
import clear from 'esbuild-plugin-clear';

await esbuild.build({
    entryPoints: ['./src/index.js', './src/admin.js'],
    bundle:      true,
    outdir:      './dist',
    plugins:     [
        clear('./dist'),
    ],
});
```

The plugin works with `outfile` and with `outdir`, because it only knows the path you give it.

## Together with esbuild-plugin-copy

Clear first, then build, then copy the static files:

```js
import esbuild from 'esbuild';
import clear from 'esbuild-plugin-clear';
import copy from 'esbuild-copy-plugin';

await esbuild.build({
    entryPoints: ['./src/index.js'],
    bundle:      true,
    outfile:     './dist/index.js',
    plugins:     [
        clear('./dist'),
        copy({from: './public', to: '.'}),
    ],
});
```

## Several builds into the same folder

If several builds write into the same folder, put `clear` into only one of them. That build has to finish before the
others start, otherwise it may delete what another build just wrote:

```js
await esbuild.build({
    entryPoints: ['./src/index.js'],
    bundle:      true,
    outfile:     './dist/index.js',
    plugins:     [
        clear('./dist'),
    ],
});

await esbuild.build({
    entryPoints: ['./src/worker.js'],
    bundle:      true,
    outfile:     './dist/worker.js',
});
```

## Watch mode

With `esbuild.context()` and `watch()` the plugin deletes the folder before every rebuild. Files that do not come from
esbuild disappear as well. So do not put them into the output folder by hand; let
[esbuild-plugin-copy](https://www.marco-starker.de/en/projects/esbuild-plugin-copy) copy them in after every build.

```js
const ctx = await esbuild.context({
    entryPoints: ['./src/index.js'],
    bundle:      true,
    outfile:     './dist/index.js',
    plugins:     [
        clear('./dist'),
    ],
});

await ctx.watch();
```
