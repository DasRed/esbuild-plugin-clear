# esbuild-plugin-clear

esbuild plugin that deletes a folder before every build, so no stale files are left in the output directory.

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
        clear('./dist'),
    ],
});
```

> [!CAUTION]
> The plugin deletes the given path without any check. `clear('.')` deletes your whole project.

## License

[MIT](LICENSE)
