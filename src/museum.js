import * as Cesium from 'cesium';

// The high-quality British Museum model, geo-placed at Bloomsbury. These
// values are the calibrated transform carried over from the model-alignment
// sandbox (scale/heading/height tuned by hand against the satellite imagery).
export const MUSEUM = {
  lat: 51.51965,
  lon: -0.12718,
  heightOffset: -10, // metres, relative to ground
  heading: 55, // degrees
  scale: 85.9,
  modelUrl: `${import.meta.env.BASE_URL}models/british-museum.glb`,
};

// The opening "hero" framing — a NW-facing low-angle look at the columns and
// entrance, also carried over from the alignment sandbox.
export const HERO_VIEW = {
  destination: Cesium.Cartesian3.fromDegrees(
    -0.11998240713621232,
    51.51715855900223,
    349.62060273944223
  ),
  orientation: {
    heading: Cesium.Math.toRadians(305.0),
    pitch: Cesium.Math.toRadians(-30.0),
    roll: Cesium.Math.toRadians(0.0),
  },
};

let museumEntity = null;

// Place (or replace) the museum model. Returns the created entity.
export async function addMuseum(viewer) {
  if (museumEntity) {
    viewer.entities.remove(museumEntity);
    museumEntity = null;
  }

  const position = Cesium.Cartesian3.fromDegrees(
    MUSEUM.lon,
    MUSEUM.lat,
    MUSEUM.heightOffset
  );
  const hpr = new Cesium.HeadingPitchRoll(
    Cesium.Math.toRadians(MUSEUM.heading),
    0,
    0
  );
  const orientation = Cesium.Transforms.headingPitchRollQuaternion(position, hpr);

  museumEntity = viewer.entities.add({
    name: 'The British Museum',
    position,
    orientation,
    model: {
      uri: MUSEUM.modelUrl,
      scale: MUSEUM.scale,
      heightReference: Cesium.HeightReference.RELATIVE_TO_GROUND,
    },
  });

  return museumEntity;
}

export function getMuseumEntity() {
  return museumEntity;
}

// The fixed geographic anchor of the museum (where the artefact pile sits).
export function museumAnchor() {
  return Cesium.Cartesian3.fromDegrees(MUSEUM.lon, MUSEUM.lat, MUSEUM.heightOffset);
}

export function flyToHeroView(viewer, animate = true) {
  if (animate) {
    viewer.camera.flyTo({ ...HERO_VIEW, duration: 3.0 });
  } else {
    viewer.camera.setView(HERO_VIEW);
  }
}
