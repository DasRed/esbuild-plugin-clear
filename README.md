# esbuild-plugin-clear

esbuild plugin that deletes the output folder before every build, so no stale files are left in the output directory.
Ships as ESM and CommonJS with TypeScript types.

Documentation: https://www.marco-starker.de/en/projects/esbuild-plugin-clear/docs
(Deutsch: https://www.marco-starker.de/de/projekte/esbuild-plugin-clear/doku)

## Quick start

```bash
npm i -D esbuild-plugin-clear
```

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

Without a path the plugin clears `outdir` or the folder of `outfile`. It refuses to delete the working directory, one
of its parents or anything outside of it unless you set `allowOutsideWorkingDir`.

## Local development

```bash
npm ci
npm test
npm run build
```

The package itself runs on Node.js 22.13 or later. Building and testing need Node.js 22.18 or later.

## License

[MIT](LICENSE)
