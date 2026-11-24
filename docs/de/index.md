---
title: Überblick
description: esbuild-plugin-clear löscht vor jedem esbuild-Build den Ausgabeordner, damit keine alten Dateien liegen bleiben. Kurzbeispiel, Ablauf und Sicherheitsprüfungen.
order: 0
section: Einstieg
---

esbuild überschreibt seine Ausgabedateien, löscht aber nichts. Benennst du einen Entry Point um oder fällt ein Chunk
weg, bleiben die alten Dateien in `dist/` liegen. `esbuild-plugin-clear` löscht den Ausgabeordner vor jedem Build,
sodass nur das übrig bleibt, was der aktuelle Build erzeugt.

## Kurzbeispiel

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

Ohne Pfad leert das Plugin den Ausgabeordner des Builds, hier `dist/`.

## Was das Plugin macht

- Es hängt sich an das `onStart` von esbuild und löscht den Ordner samt Inhalt, im Watch-Modus also vor jedem
  Rebuild.
- Ohne Pfad nimmt es `outdir` oder den Ordner von `outfile`.
- Pfade gelten relativ zu `absWorkingDir` des Builds, ohne `absWorkingDir` relativ zum aktuellen Ordner.
- Gibt es den Ordner nicht, passiert nichts. esbuild legt ihn beim Schreiben der Ausgabe wieder an.

## Sicherheitsprüfungen

Das Plugin löscht nie den Arbeitsordner oder einen seiner Elternordner. `clear('.')` lässt deshalb den Build
fehlschlagen, statt dein Projekt zu löschen. Pfade außerhalb des Arbeitsordners lehnt es ebenfalls ab, solange du sie
nicht ausdrücklich erlaubst. Die Einzelheiten stehen unter [Optionen](options.md#sicherheitsprüfungen).

## Status

Version 2, 2026 in TypeScript neu geschrieben. Wird als ESM und CommonJS mit Typdefinitionen ausgeliefert. Getestet
mit esbuild 0.28 und Node.js 22 und 26. Du kommst von Version 1? Siehe [Migration](migration.md).

## Verwandte Pakete

Die drei esbuild-Plugins sind als Satz gedacht:

- [esbuild-plugin-copy](https://www.marco-starker.de/de/projekte/esbuild-plugin-copy): kopiert nach dem Build Dateien
  in das Ausgabeverzeichnis.
- [esbuild-plugin-time](https://www.marco-starker.de/de/projekte/esbuild-plugin-time): misst, wie lange der Build
  dauert.
