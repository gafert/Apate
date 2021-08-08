import { BufferAttribute, BufferGeometry, Color, Mesh, TextureLoader } from 'three';
import { makeBox, setUVofVertex } from './3Dhelpers';
import NODE_IMAGE from './node.png';
import { MarkerMaterial } from './MarkerMaterial';
import { GraphNode } from './GraphNode';

export class GenericNode extends GraphNode {
  private border = 0.15;

  constructor(name: string, width: number, height: number, globalUniforms) {
    super(name);

    const geometry = new BufferGeometry();

    // Top
    const cornerLeftTop = makeBox(this.border, this.border);
    const top = makeBox(width - this.border - this.border, this.border, this.border);
    const cornerRightTop = makeBox(this.border, this.border, width - this.border);

    // Middle
    const left = makeBox(this.border, height - this.border - this.border, 0, -this.border);
    const middle = makeBox(width - this.border - this.border, height - this.border - this.border, this.border, -this.border);
    const right = makeBox(this.border, height - this.border - this.border, width - this.border, -this.border);

    // Bottom
    const cornerLeftBottom = makeBox(this.border, this.border, 0, -height + this.border);
    const bottom = makeBox(width - this.border - this.border, this.border, this.border, -height + this.border);
    const cornerRightBottom = makeBox(this.border, this.border, width - this.border, -height + this.border);

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

    const loader = new TextureLoader();
    const backgroundTexture = loader.load(NODE_IMAGE);

    const mesh = new Mesh(geometry, new MarkerMaterial({
      color: new Color(0xffffff),
      globalUniforms: globalUniforms,
      map: backgroundTexture
    }))

    this.renderGroup.add(mesh);
  }
}
