---
title: Usage
description: Typical uses of esbuild-plugin-clear: clearing the output folder, an explicit path, watch mode, several builds, monorepos and esbuild-plugin-copy.
order: 20
slug: usage
section: Getting started
---

## Clear the output folder

Without arguments the plugin clears the output folder of the build: `outdir`, or the folder of `outfile`.

```js
import esbuild from 'esbuild';
import clear from 'esbuild-plugin-clear';

await esbuild.build({
    entryPoints: ['./src/index.js', './src/admin.js'],
    bundle:      true,
    outdir:      './dist',
    plugins:     [
        clear(),
    ],
});
```

## Clear another path

Pass a path if you want to delete something else, e.g. only a subfolder of the output:

```js
clear('./dist/assets')
```

The path is resolved relative to `absWorkingDir` of the build. Without `absWorkingDir` it is relative to the folder
you start the build from.

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
        clear(),
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
        clear(),
    ],
});

await esbuild.build({
    entryPoints: ['./src/worker.js'],
    bundle:      true,
    outfile:     './dist/worker.js',
});
```

## Output outside the project

In a monorepo the output often lives next to the package, e.g. `../server/public/app`. The plugin refuses such paths
unless you allow them:

```js
clear({path: '../server/public/app', allowOutsideWorkingDir: true})
```

Even then it never deletes the working directory or one of its parents.

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
        clear(),
    ],
});

await ctx.watch();
```
