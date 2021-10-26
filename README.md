# esbuild-plugin-clear

Clears the given directory.

## Installation

```
npm i --save-dev esbuild-plugin-clear
```

## Usage

```javascript
import esbuild from 'esbuild';
import clear from 'esbuild-plugin-clear';

esbuild.build({
    entryPoints: ['./src/index.js'],
    bundle:      true,
    outfile:     './dist/index.js',
    plugins:     [
        clear('./dist')
    ]
});
```
