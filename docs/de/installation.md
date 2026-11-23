---
title: Installation
description: esbuild-plugin-clear per npm als Dev-Abhängigkeit installieren und welche Versionen von Node.js und esbuild du brauchst, damit das Löschen vor dem Build klappt.
order: 10
slug: installation
section: Einstieg
---

Das Plugin brauchst du nur beim Bauen, also als Dev-Abhängigkeit.

## Paket installieren

```bash
npm i -D esbuild-plugin-clear
```

esbuild bringt das Plugin nicht mit. Falls es noch fehlt:

```bash
npm i -D esbuild
```

## Voraussetzungen

| Was     | Version          | Warum                                                    |
|---------|------------------|----------------------------------------------------------|
| Node.js | ab 14.14         | Das Plugin löscht mit `fs.rmSync`, das es ab 14.14 gibt   |
| esbuild | mit Plugin-API   | Getestet mit 0.28; gebraucht wird nur `onStart`          |

> [!NOTE]
> Das Paket ist reines ESM und hat nur einen Default-Export. Schreib dein Build-Skript als `.mjs` oder setz
> `"type": "module"` in deiner `package.json`.
