import {Geometry, Vector2} from "three";

export function computeUVsOfPlane(geometry: Geometry) {
  geometry.computeBoundingBox();

  const max = geometry.boundingBox.max,
    min = geometry.boundingBox.min;
  const offset = new Vector2(0 - min.x, 0 - min.y);
  const range = new Vector2(max.x - min.x, max.y - min.y);
  const faces = geometry.faces;

  geometry.faceVertexUvs[0] = [];

  for (let i = 0; i < faces.length; i++) {

    const v1 = geometry.vertices[faces[i].a],
      v2 = geometry.vertices[faces[i].b],
      v3 = geometry.vertices[faces[i].c];

    geometry.faceVertexUvs[0].push([
      new Vector2((v1.x + offset.x) / range.x, (v1.y + offset.y) / range.y),
      new Vector2((v2.x + offset.x) / range.x, (v2.y + offset.y) / range.y),
      new Vector2((v3.x + offset.x) / range.x, (v3.y + offset.y) / range.y)
    ]);
  }
  geometry.uvsNeedUpdate = true;
}
