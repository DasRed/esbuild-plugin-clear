---
title: Migration
description: What changed in esbuild-plugin-clear from version 1 to 2: default path, path resolution, safety checks, CommonJS, TypeScript types and Node.js.
order: 40
slug: migration
section: Reference
---

## From 1 to 2

Version 2 is a rewrite in TypeScript. `clear('./dist')` keeps working, but a few things behave differently.

| Topic              | Version 1                                       | Version 2                                                      |
|--------------------|-------------------------------------------------|----------------------------------------------------------------|
| Path               | required                                        | optional, defaults to `outdir` or the folder of `outfile`       |
| Relative to        | the current folder of the process               | `absWorkingDir` of the build, otherwise the current folder      |
| `clear('.')`       | deletes the whole project                       | fails the build, nothing is deleted                            |
| Outside the project | deleted without asking                         | fails unless `allowOutsideWorkingDir: true`                    |
| Problems           | uncaught exception                              | esbuild error with a message                                   |
| Plugin name        | `Clear`                                         | `clear`                                                        |
| Module formats     | ESM only                                        | ESM and CommonJS, with type definitions                        |
| Node.js            | 14.14 or later                                  | 22.13 or later                                                  |

## What to check

- If your output folder lies outside the project (monorepo, `../public`), add `allowOutsideWorkingDir: true`.
- If you set `absWorkingDir` and pass a relative path, the path is now relative to `absWorkingDir`.
- If you check messages or plugin names in your own tooling, the name is now `clear`.
