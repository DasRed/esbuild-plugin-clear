---
title: Optionen
description: Der einzige Parameter von esbuild-plugin-clear, sein Verhalten und die bekannten Grenzen.
order: 30
slug: optionen
section: Referenz
---

`clear()` nimmt einen Pfad und gibt ein esbuild-Plugin mit dem Namen `Clear` zurück.

```js
clear('./dist')
```

## Parameter

| Name   | Typ      | Standard | Beschreibung                                                                 |
|--------|----------|----------|------------------------------------------------------------------------------|
| `path` | `string` | Pflicht  | Ordner (oder Datei), der vor jedem Build gelöscht wird. Relativ zum Ordner, aus dem du den Build startest |

## Verhalten

- Gelöscht wird in `onStart`, also bevor esbuild etwas schreibt.
- Der Ordner wird mit allem Inhalt entfernt (`fs.rmSync` mit `recursive: true`), nicht nur geleert.
- Gibt es den Pfad nicht, macht das Plugin nichts.

## Einschränkungen

- **Keine Sicherheitsprüfung.** Das Plugin prüft nicht, ob der Pfad im Projekt liegt oder der Ausgabeordner ist. Ein
  Tippfehler wie `clear('./')` löscht das ganze Projekt.
- **Pfad relativ zum aktuellen Ordner des Prozesses**, nicht zu `absWorkingDir`.
- **Alles oder nichts.** Einzelne Dateien behalten oder nur bestimmte Dateien löschen geht nicht.
- **Keine Abstimmung zwischen Builds.** Laufen mehrere Builds parallel in denselben Ordner, siehe
  [Verwendung](usage.md#mehrere-builds-in-denselben-ordner).
