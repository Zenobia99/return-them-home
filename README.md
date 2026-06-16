# Return Them Home

A cinematic CesiumJS experience. It opens on the **real 3D British Museum** at
Bloomsbury on a photoreal Earth, then pulls back as **5,000 real object
photographs stream home** along glowing great-circle arcs to 88 nations — a
second pass replays the acquisitions year by year.

This is the combined successor to two earlier projects:

- `british-museum-repatriation-map` — the storytelling globe (data + the
  repatriation animation, originally a no-build three.js app).
- `British-museum-model-globe` — the photoreal building sandbox (CesiumJS +
  the high-quality museum model).

See [`PLAN.md`](./PLAN.md) for the full architecture and roadmap.

## Stack

- **CesiumJS** for the photoreal globe, terrain, imagery, and the building model.
- **Vite** for the dev server and build (`vite-plugin-cesium` serves Cesium's
  static assets — they are never committed to the repo).
- Deploys as a static build to **GitHub Pages**.

## Getting started

Requires Node.js 18+.

```bash
npm install
cp .env.example .env.local   # add your Cesium Ion token (free)
npm run dev                  # http://localhost:5176
```

Without a Cesium Ion token the app still runs, falling back to token-free
OpenStreetMap imagery and a plain ellipsoid (no terrain). Add a token in
`.env.local` for the full photoreal satellite imagery + world terrain.

```bash
npm run build     # production build -> dist/
npm run preview   # preview the production build
npm run deploy    # build + publish dist/ to GitHub Pages
```

## Status

**Phase 1 — scaffold.** Cesium viewer boots; the British Museum model is
geo-placed at Bloomsbury with the calibrated transform and the app opens on
the hero view. Phases 2-5 (artefact data, the GPU streaming animation, the
narrative timeline, polish) follow per `PLAN.md`.

## Hardware baseline

This 3D experience targets Apple Mac mini (M4) class hardware and up — it is
meant to be cinematic. Lower-functioning hardware falls back to the existing
2D map. No low-poly proxy models.

## Licence

Object photographs © The Trustees of the British Museum, CC BY-NC-SA 4.0
unless noted otherwise.
