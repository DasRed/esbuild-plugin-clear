---
title: Options
description: The options of esbuild-plugin-clear: path and allowOutsideWorkingDir, how the path is resolved, the safety checks before deleting and the remaining limitations.
order: 30
slug: options
section: Reference
---

`clear()` takes a path or an options object and returns an esbuild plugin named `clear`.

```js
clear()
clear('./dist')
clear({path: './dist', allowOutsideWorkingDir: false})
```

A string is short for `{path: '…'}`.

## Options

| Name                     | Type      | Default            | Description                                                              |
|--------------------------|-----------|--------------------|--------------------------------------------------------------------------|
| `path`                   | `string`  | the output folder  | Folder or file to delete. Relative to `absWorkingDir` of the build        |
| `allowOutsideWorkingDir` | `boolean` | `false`            | Allows deleting a path outside the working directory                     |

The output folder is `outdir`, or the folder of `outfile` if `outdir` is not set.

## Behaviour

- Deletion happens in `onStart`, i.e. before esbuild writes anything.
- The folder is removed with all its contents, not just emptied.
- If the path does not exist, the plugin does nothing.
- Problems are reported as esbuild errors, so the build fails with a clear message instead of a crash.

## Safety checks

Before deleting, the plugin resolves the path and checks it. The working directory is `absWorkingDir`, or the current
folder of the process.

| Case                                              | Result                                          |
|---------------------------------------------------|-------------------------------------------------|
| No `path`, no `outdir`, no `outfile`              | error, nothing is deleted                       |
| The working directory itself or one of its parents | error, even with `allowOutsideWorkingDir`       |
| Outside the working directory                     | error, unless `allowOutsideWorkingDir` is set   |
| Inside the working directory                      | deleted                                         |

An `outfile` directly in the project, e.g. `./index.js`, therefore fails without `path`, because its folder is the
working directory.

## Limitations

- **All or nothing.** Keeping single files or deleting only certain files is not possible.
- **No coordination between builds.** If several builds run in parallel into the same folder, see
  [Usage](usage.md#several-builds-into-the-same-folder).
- **Symbolic links are not followed for the checks.** A link inside the project that points somewhere else counts as
  inside; the link itself is deleted, not its target.
