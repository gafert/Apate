import {BufferAttribute, BufferGeometry, Color, Mesh, TextureLoader} from "three";
import {makeBox, setUVofVertex} from "./3Dhelpers";
import NODE_IMAGE from "./node.png";
import {MarkerMaterial} from "./MarkerMaterial";
import {GLOBAL_UNIFORMS} from "../utils/globals";

const loader = new TextureLoader();

export const NINE_PATCHES = {
  NODE: {
    leftBorder: 0.15,
    rightBorder: 0.15,
    topBorder: 0.15,
    bottomBorder: 0.15,
  }
}

export function makeNinePatch(width, height, border): Mesh {
  const geometry = new BufferGeometry();

  const b = border;
  const w = width;
  const h = height;

  // Top
  const cornerLeftTop = makeBox(b, b);
  const top = makeBox(w - b - b, b, b);
  const cornerRightTop = makeBox(b, b, w - b);

  // Middle
  const left = makeBox(b, h - b - b, 0, -b);
  const middle = makeBox(w - b - b, h - b - b, b, -b);
  const right = makeBox(b, h - b - b, w - b, -b);

  // Bottom
  const cornerLeftBottom = makeBox(b, b, 0, -h + b);
  const bottom = makeBox(w - b - b, b, b, -h + b);
  const cornerRightBottom = makeBox(b, b, w - b, -h + b);

  const vertices = [
    ...cornerLeftTop, ...top, ...cornerRightTop, ...left, ...middle, ...right, ...cornerLeftBottom, ...bottom, ...cornerRightBottom
  ];
  // const uv = setUVofVertex(0, 1, 0, 1, vertices);

  geometry.setAttribute('position', new BufferAttribute(new Float32Array(vertices), 3));
  geometry.setAttribute('uv', new BufferAttribute(new Float32Array([
    // Top
    ...setUVofVertex(0, 0.125, 0.875, 1, cornerLeftTop),
    ...setUVofVertex(0.125, 0.875, 0.875, 1, top),
    ...setUVofVertex(0.875, 1, 0.875, 1, cornerRightTop),
    // Middle
    ...setUVofVertex(0, 0.125, 0.125, 0.875, left),
    ...setUVofVertex(0.125, 0.875, 0.125, 0.875, middle),
    ...setUVofVertex(0.875, 1, 0.125, 0.875, right),
    // Bottom
    ...setUVofVertex(0, 0.125, 0, 0.125, cornerLeftBottom),
    ...setUVofVertex(0.125, 0.875, 0, 0.125, bottom),
    ...setUVofVertex(0.875, 1, 0, 0.125, cornerRightBottom)
  ]), 2));

  const backgroundTexture = loader.load(NODE_IMAGE);

  const mesh = new Mesh(geometry, new MarkerMaterial({
    color: new Color(0xffffff),
    globalUniforms: GLOBAL_UNIFORMS,
    map: backgroundTexture
  }));

  return mesh;
}
