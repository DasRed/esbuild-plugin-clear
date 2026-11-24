---
title: Migration
description: Was sich bei esbuild-plugin-clear von Version 1 auf 2 geändert hat: Standardpfad, Auflösung des Pfads, Sicherheitsprüfungen, CommonJS und Node.js.
order: 40
slug: migration
section: Referenz
---

## Von 1 auf 2

Version 2 ist in TypeScript neu geschrieben. `clear('./dist')` funktioniert weiter, einiges verhält sich aber anders.

| Thema                 | Version 1                              | Version 2                                                       |
|-----------------------|----------------------------------------|-----------------------------------------------------------------|
| Pfad                  | Pflicht                                | optional, Standard ist `outdir` oder der Ordner von `outfile`    |
| Relativ zu            | dem aktuellen Ordner des Prozesses     | `absWorkingDir` des Builds, sonst dem aktuellen Ordner          |
| `clear('.')`          | löscht das ganze Projekt               | Build schlägt fehl, nichts wird gelöscht                        |
| Außerhalb des Projekts | wird ohne Rückfrage gelöscht          | Fehler, außer mit `allowOutsideWorkingDir: true`                |
| Probleme              | unbehandelte Exception                 | esbuild-Fehler mit Meldung                                      |
| Name des Plugins      | `Clear`                                | `clear`                                                         |
| Modulformate          | nur ESM                                | ESM und CommonJS, mit Typdefinitionen                           |
| Node.js               | ab 14.14                               | ab 22.13                                                        |

## Was du prüfen solltest

- Liegt dein Ausgabeordner außerhalb des Projekts (Monorepo, `../public`), ergänze `allowOutsideWorkingDir: true`.
- Setzt du `absWorkingDir` und gibst einen relativen Pfad an, gilt der Pfad jetzt relativ zu `absWorkingDir`.
- Prüft dein eigenes Tooling Meldungen oder Plugin-Namen, heißt das Plugin jetzt `clear`.
