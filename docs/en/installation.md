---
title: Installation
description: Install esbuild-plugin-clear via npm as a dev dependency and which versions of Node.js and esbuild you need so the folder is cleared before each build.
order: 10
slug: installation
section: Getting started
---

You only need the plugin at build time, so add it as a dev dependency.

## Install the package

```bash
npm i -D esbuild-plugin-clear
```

The plugin does not ship esbuild. If it is missing:

```bash
npm i -D esbuild
```

## Requirements

| What    | Version         | Why                                                        |
|---------|-----------------|------------------------------------------------------------|
| Node.js | 14.14 or later  | The plugin deletes with `fs.rmSync`, available since 14.14 |
| esbuild | with plugin API | Tested with 0.28; only `onStart` is used                   |

> [!NOTE]
> The package is pure ESM with a single default export. Write your build script as `.mjs` or set `"type": "module"`
> in your `package.json`.
