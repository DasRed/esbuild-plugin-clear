---
title: Options
description: The path parameter of esbuild-plugin-clear, when and how the folder is deleted before the esbuild build starts and which limitations you should know about.
order: 30
slug: options
section: Reference
---

`clear()` takes a path and returns an esbuild plugin named `Clear`.

```js
clear('./dist')
```

## Parameter

| Name   | Type     | Default  | Description                                                                          |
|--------|----------|----------|--------------------------------------------------------------------------------------|
| `path` | `string` | required | Folder (or file) deleted before every build. Relative to the folder you start the build from |

## Behaviour

- Deletion happens in `onStart`, i.e. before esbuild writes anything.
- The folder is removed with all its contents (`fs.rmSync` with `recursive: true`), not just emptied.
- If the path does not exist, the plugin does nothing.

## Limitations

- **No safety check.** The plugin does not check whether the path lies inside the project or is the output folder. A
  typo like `clear('./')` deletes the whole project.
- **Path relative to the current folder of the process**, not to `absWorkingDir`.
- **All or nothing.** Keeping single files or deleting only certain files is not possible.
- **No coordination between builds.** If several builds run in parallel into the same folder, see
  [Usage](usage.md#several-builds-into-the-same-folder).
