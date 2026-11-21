---
title: Überblick
description: esbuild-Plugin, das vor jedem Build einen Ordner löscht, damit keine alten Dateien im Ausgabeverzeichnis liegen bleiben.
order: 0
section: Einstieg
---

esbuild überschreibt seine Ausgabedateien, löscht aber nichts. Benennst du einen Entry Point um oder fällt ein Chunk
weg, bleiben die alten Dateien in `dist/` liegen. `esbuild-plugin-clear` löscht den Ordner vor jedem Build, sodass
nur das übrig bleibt, was der aktuelle Build erzeugt.

## Kurzbeispiel

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

## Was das Plugin macht

- Es hängt sich an das `onStart` von esbuild und löscht den angegebenen Ordner samt Inhalt, im Watch-Modus also vor
  jedem Rebuild.
- Gibt es den Ordner nicht, passiert nichts.
- esbuild legt den Ordner danach beim Schreiben der Ausgabe wieder an.

> [!CAUTION]
> Das Plugin löscht ohne Rückfrage und ohne Prüfung, was du angibst. `clear('.')` löscht dein ganzes Projekt.

## Status

Version 1.0.1, geschrieben 2021. Getestet mit esbuild 0.28 und Node.js 22.

## Verwandte Pakete

Die drei esbuild-Plugins sind als Satz gedacht:

- [esbuild-plugin-copy](https://www.marco-starker.de/de/projekte/esbuild-plugin-copy): kopiert nach dem Build Dateien
  in das Ausgabeverzeichnis.
- [esbuild-plugin-time](https://www.marco-starker.de/de/projekte/esbuild-plugin-time): misst, wie lange der Build
  dauert.
