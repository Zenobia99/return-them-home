import { defineConfig } from 'vite';
import cesium from 'vite-plugin-cesium';

// GitHub Pages serves this project from /return-them-home/.
// `vite-plugin-cesium` copies Cesium's static assets (Workers, Assets,
// Widgets, ThirdParty) and wires up CESIUM_BASE_URL automatically, so we
// never commit the Cesium build into the repo.
// Vite's dev-optimized Cesium bundle needs eval; production doesn't. Relax
// the CSP only for `vite dev` so the deployed policy stays strict.
const devCsp = {
  name: 'dev-csp-unsafe-eval',
  apply: 'serve',
  transformIndexHtml(html) {
    return html.replace("script-src 'self'", "script-src 'self' 'unsafe-eval'");
  },
};

export default defineConfig({
  base: '/return-them-home/',
  plugins: [cesium(), devCsp],
  server: {
    port: 5180,
    // Loopback only — pass `vite --host` when phone-testing on the LAN.
  },
  build: {
    // The high-quality British Museum model is ~15MB; don't warn about it.
    chunkSizeWarningLimit: 4096,
  },
});
