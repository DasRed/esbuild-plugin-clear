---
title: Verwendung
description: Typische Einsätze von esbuild-plugin-clear – Ausgabeordner leeren, Watch-Modus, mehrere Builds und Kombination mit copy.
order: 20
slug: verwendung
section: Einstieg
---

## Ausgabeordner vor dem Build leeren

Gib dem Plugin den Ordner, in den esbuild schreibt:

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

Das Plugin funktioniert mit `outfile` und mit `outdir`, denn es kennt nur den Pfad, den du ihm gibst.

## Zusammen mit esbuild-plugin-copy

Erst leeren, dann bauen, dann statische Dateien kopieren:

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

## Mehrere Builds in denselben Ordner

Schreiben mehrere Builds in denselben Ordner, gehört `clear` nur in einen davon. Und dieser Build muss fertig sein,
bevor die anderen starten, sonst löscht er womöglich, was ein anderer Build gerade geschrieben hat:

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

## Watch-Modus

Mit `esbuild.context()` und `watch()` löscht das Plugin den Ordner vor jedem Rebuild. Dateien, die nicht von esbuild
kommen, verschwinden dabei ebenfalls. Leg sie deshalb nicht von Hand in den Ausgabeordner, sondern lass sie per
[esbuild-plugin-copy](https://www.marco-starker.de/de/projekte/esbuild-plugin-copy) nach jedem Build hineinkopieren.

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
