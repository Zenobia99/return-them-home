import { existsSync, renameSync, rmSync } from 'node:fs';

// vite-plugin-cesium copies Cesium's static assets to `dist/<base>/cesium`
// (here dist/return-them-home/cesium) but the HTML/CESIUM_BASE_URL reference
// them at `<base>/cesium` (/return-them-home/cesium). On a GitHub project
// Pages site (served at /return-them-home/), the repo root IS that base, so
// the referenced path resolves to dist/cesium — not the nested copy. Move the
// assets to dist/cesium so they line up. (No effect on `npm run dev`.)
const nested = 'dist/return-them-home/cesium';
const target = 'dist/cesium';

if (existsSync(nested)) {
  rmSync(target, { recursive: true, force: true });
  renameSync(nested, target);
  rmSync('dist/return-them-home', { recursive: true, force: true });
  console.log('[postbuild] moved Cesium assets -> dist/cesium');
} else {
  console.log('[postbuild] no nested Cesium copy found; nothing to do');
}
