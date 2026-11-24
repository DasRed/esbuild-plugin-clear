---
title: Optionen
description: Die Optionen von esbuild-plugin-clear: path und allowOutsideWorkingDir, wie der Pfad aufgelöst wird, die Sicherheitsprüfungen und die Einschränkungen.
order: 30
slug: optionen
section: Referenz
---

`clear()` nimmt einen Pfad oder ein Objekt mit Optionen und gibt ein esbuild-Plugin mit dem Namen `clear` zurück.

```js
clear()
clear('./dist')
clear({path: './dist', allowOutsideWorkingDir: false})
```

Ein String ist die Kurzform für `{path: '…'}`.

## Optionen

| Name                     | Typ       | Standard          | Beschreibung                                                         |
|--------------------------|-----------|-------------------|----------------------------------------------------------------------|
| `path`                   | `string`  | der Ausgabeordner | Ordner oder Datei, die gelöscht wird. Relativ zu `absWorkingDir`      |
| `allowOutsideWorkingDir` | `boolean` | `false`           | Erlaubt das Löschen außerhalb des Arbeitsordners                     |

Der Ausgabeordner ist `outdir` oder, wenn `outdir` fehlt, der Ordner von `outfile`.

## Verhalten

- Gelöscht wird in `onStart`, also bevor esbuild etwas schreibt.
- Der Ordner wird mit allem Inhalt entfernt, nicht nur geleert.
- Gibt es den Pfad nicht, macht das Plugin nichts.
- Probleme meldet das Plugin als esbuild-Fehler. Der Build bricht dann mit einer klaren Meldung ab statt mit einem
  Absturz.

## Sicherheitsprüfungen

Vor dem Löschen löst das Plugin den Pfad auf und prüft ihn. Arbeitsordner ist `absWorkingDir` oder der aktuelle
Ordner des Prozesses.

| Fall                                                  | Ergebnis                                           |
|-------------------------------------------------------|----------------------------------------------------|
| Kein `path`, kein `outdir`, kein `outfile`            | Fehler, nichts wird gelöscht                       |
| Der Arbeitsordner selbst oder einer seiner Elternordner | Fehler, auch mit `allowOutsideWorkingDir`         |
| Außerhalb des Arbeitsordners                          | Fehler, außer `allowOutsideWorkingDir` ist gesetzt |
| Innerhalb des Arbeitsordners                          | wird gelöscht                                      |

Ein `outfile` direkt im Projekt, etwa `./index.js`, schlägt ohne `path` deshalb fehl, weil sein Ordner der
Arbeitsordner ist.

## Einschränkungen

- **Alles oder nichts.** Einzelne Dateien behalten oder nur bestimmte Dateien löschen geht nicht.
- **Keine Abstimmung zwischen Builds.** Laufen mehrere Builds parallel in denselben Ordner, siehe
  [Verwendung](usage.md#mehrere-builds-in-denselben-ordner).
- **Symbolische Links werden für die Prüfung nicht aufgelöst.** Ein Link im Projekt, der woanders hinzeigt, gilt als
  innerhalb. Gelöscht wird der Link selbst, nicht sein Ziel.
