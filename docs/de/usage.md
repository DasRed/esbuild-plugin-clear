---
title: Verwendung
description: Typische Einsätze von esbuild-plugin-clear: Ausgabeordner leeren, eigener Pfad, Watch-Modus, mehrere Builds, Monorepos und Kombination mit copy.
order: 20
slug: verwendung
section: Einstieg
---

## Ausgabeordner leeren

Ohne Argument leert das Plugin den Ausgabeordner des Builds: `outdir` oder den Ordner von `outfile`.

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

## Einen anderen Pfad leeren

Gib einen Pfad an, wenn du etwas anderes löschen willst, zum Beispiel nur einen Unterordner der Ausgabe:

```js
clear('./dist/assets')
```

Der Pfad gilt relativ zu `absWorkingDir` des Builds. Ohne `absWorkingDir` gilt er relativ zum Ordner, aus dem du den
Build startest.

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
        clear(),
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
        clear(),
    ],
});

await esbuild.build({
    entryPoints: ['./src/worker.js'],
    bundle:      true,
    outfile:     './dist/worker.js',
});
```

## Ausgabe außerhalb des Projekts

In einem Monorepo liegt die Ausgabe oft neben dem Paket, etwa in `../server/public/app`. Solche Pfade lehnt das
Plugin ab, solange du sie nicht erlaubst:

```js
clear({path: '../server/public/app', allowOutsideWorkingDir: true})
```

Auch dann löscht es nie den Arbeitsordner oder einen seiner Elternordner.

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
        clear(),
    ],
});

await ctx.watch();
```
