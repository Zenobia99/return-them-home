import * as Cesium from 'cesium';

// A small always-visible camera control cluster (zoom + rotate) so the user
// has consistent, obvious interactivity in every part of the app — including
// the close-up museum framings where free-drag globe controls feel different.
export function mountCameraControls(viewer) {
  const scene = viewer.scene;
  const cam = scene.camera;

  const el = document.createElement('div');
  el.id = 'cam-controls';
  el.innerHTML = `
    <button data-act="in"    title="Zoom in"   aria-label="Zoom in">+</button>
    <button data-act="out"   title="Zoom out"  aria-label="Zoom out">&minus;</button>
    <button data-act="left"  title="Rotate left"  aria-label="Rotate left">&#8634;</button>
    <button data-act="right" title="Rotate right" aria-label="Rotate right">&#8635;</button>
  `;
  document.body.appendChild(el);

  // The point the camera is looking at on the globe (screen centre), used as
  // the pivot for orbit so rotation feels like a turntable at any zoom.
  function lookCenter() {
    const w = scene.canvas.clientWidth;
    const h = scene.canvas.clientHeight;
    return cam.pickEllipsoid(
      new Cesium.Cartesian2(w / 2, h / 2),
      scene.globe.ellipsoid
    );
  }

  function orbit(angle) {
    const center = lookCenter();
    if (!center) {
      // Looking at space — just spin around the Earth's axis.
      cam.rotate(Cesium.Cartesian3.UNIT_Z, angle);
      return;
    }
    const frame = Cesium.Transforms.eastNorthUpToFixedFrame(center);
    cam.lookAtTransform(frame);
    cam.rotateRight(angle); // orbit horizontally around the look-at point
    cam.lookAtTransform(Cesium.Matrix4.IDENTITY); // release the frame
  }

  el.addEventListener('click', (e) => {
    const btn = e.target.closest('button');
    if (!btn) return;
    const act = btn.dataset.act;
    const step = Math.max(cam.positionCartographic.height * 0.4, 50);
    if (act === 'in') cam.zoomIn(step);
    else if (act === 'out') cam.zoomOut(step);
    else if (act === 'left') orbit(Cesium.Math.toRadians(-22));
    else if (act === 'right') orbit(Cesium.Math.toRadians(22));
  });
}
