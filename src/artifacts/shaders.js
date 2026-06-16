// GLSL for the photo-disc primitive. Written in GLSL ES 1.00 style
// (attribute / varying / gl_FragColor); Cesium modernises it for WebGL2 and
// wires up the czm_* automatic uniforms it detects.
//
// Each disc is a camera-facing quad sized in screen pixels. The vertex shader
// slerps... (Phase 3) — for now it linearly mixes between the museum pile slot
// and the home position via u_t, which Phase 2 holds at 1.0 (home).

export const DISC_VERTEX = /* glsl */ `
attribute vec3 aHome;     // ECEF position at the origin country
attribute vec3 aMuseum;   // ECEF position in the Bloomsbury pile
attribute vec2 aCorner;   // quad corner in [-1, 1]
attribute vec2 aUv;       // atlas UV at this corner

uniform float u_t;        // 0 = museum pile, 1 = home
uniform float u_pxSize;   // disc radius in pixels

varying vec2 v_uv;
varying vec2 v_local;     // local quad coord for the circular mask

void main() {
  vec3 worldPos = mix(aMuseum, aHome, clamp(u_t, 0.0, 1.0));
  vec4 clip = czm_modelViewProjection * vec4(worldPos, 1.0);

  // Offset the corner in screen space so the quad always faces the camera and
  // keeps a constant pixel size regardless of distance.
  vec2 ndcPerPx = 2.0 / czm_viewport.zw;
  clip.xy += aCorner * u_pxSize * ndcPerPx * clip.w;

  gl_Position = clip;
  v_uv = aUv;
  v_local = aCorner;
}
`;

export const DISC_FRAGMENT = /* glsl */ `
uniform sampler2D u_atlas;

varying vec2 v_uv;
varying vec2 v_local;

void main() {
  float r = length(v_local);
  if (r > 1.0) discard;

  vec4 tex = texture2D(u_atlas, v_uv);
  float edge = smoothstep(1.0, 0.88, r); // soft circular rim
  float a = tex.a * edge;
  if (a < 0.02) discard;

  gl_FragColor = vec4(tex.rgb, a);
}
`;
