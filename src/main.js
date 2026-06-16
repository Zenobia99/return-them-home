import './style.css';
import * as Cesium from 'cesium';
import 'cesium/Build/Cesium/Widgets/widgets.css';
import { addMuseum, flyToHeroView } from './museum.js';
import { loadArtifacts, buildPositions } from './artifacts/data.js';
import { addPhotoDiscs } from './artifacts/discs.js';

// Cesium Ion powers world-scale satellite imagery and terrain. The token is
// read from the environment (VITE_CESIUM_ION_TOKEN) — never hard-coded, never
// committed. Copy .env.example to .env.local and drop your token in.
// Without a token we fall back to token-free imagery so the app still runs.
const ION_TOKEN = import.meta.env.VITE_CESIUM_ION_TOKEN;
const hasIon = typeof ION_TOKEN === 'string' && ION_TOKEN.length > 0;
if (hasIon) {
  Cesium.Ion.defaultAccessToken = ION_TOKEN;
} else {
  console.warn(
    '[return-them-home] No VITE_CESIUM_ION_TOKEN set — falling back to ' +
    'token-free OpenStreetMap imagery and a plain ellipsoid (no terrain). ' +
    'Add a token in .env.local for photoreal satellite imagery + terrain.'
  );
}

async function init() {
  const viewer = new Cesium.Viewer('cesiumContainer', {
    // Photoreal base: world terrain + aerial imagery when Ion is available.
    terrain: hasIon
      ? Cesium.Terrain.fromWorldTerrain({
          requestVertexNormals: true,
          requestWaterMask: true,
        })
      : undefined,
    baseLayer: hasIon
      ? Cesium.ImageryLayer.fromProviderAsync(
          Cesium.createWorldImageryAsync({
            style: Cesium.IonWorldImageryStyle.AERIAL,
          })
        )
      : new Cesium.ImageryLayer(
          new Cesium.OpenStreetMapImageryProvider({
            url: 'https://tile.openstreetmap.org/',
          })
        ),
    // Strip the UI chrome for a cinematic frame.
    fullscreenButton: false,
    homeButton: false,
    sceneModePicker: false,
    baseLayerPicker: false,
    geocoder: false,
    navigationHelpButton: false,
    animation: false,
    timeline: false,
    infoBox: false,
    selectionIndicator: false,
    navigationInstructionsInitiallyVisible: false,
    scene3DOnly: true,
  });

  // Cinematic atmosphere.
  const scene = viewer.scene;
  scene.globe.enableLighting = true;
  scene.skyAtmosphere.show = true;
  scene.sun.show = true;
  scene.moon.show = true;
  scene.fog.enabled = true;
  // Hide the default Cesium ion watermark/credit container clutter.
  viewer.cesiumWidget.creditContainer.style.display = 'none';

  // Phase 1: seat the real British Museum at Bloomsbury and open on the
  // hero view. The repatriation animation (Phases 3-4) builds on top of this.
  await addMuseum(viewer);
  flyToHeroView(viewer, /* animate */ false);

  // Phase 2: load the 5,000 artefacts and render them as photo-discs. The
  // discs hold u_t = 1.0 for now, so they sit at their true origin countries
  // (Phase 3 will animate u_t from 0 -> 1 to stream them home from the pile).
  const artifacts = await loadArtifacts();
  const groups = buildPositions(artifacts);
  const discs = addPhotoDiscs(viewer, groups);

  // Expose for console debugging during development.
  window.viewer = viewer;
  window.discs = discs;
}

init().catch((err) => {
  console.error('[return-them-home] init failed:', err);
});
