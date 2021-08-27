import {
  BufferAttribute,
  BufferGeometry,
  CircleGeometry,
  Color,
  Mesh,
  MeshBasicMaterial,
  TextureLoader,
  Vector3
} from 'three';
import { makeBox, setUVofVertex } from './3Dhelpers';
import NODE_IMAGE from './node.png';
import { MarkerMaterial } from './MarkerMaterial';
import { GraphNode } from './GraphNode';
import { MSDFFont } from '../services/graphServiceHelpers/msdf/MSDFFont';
import { byteToHex } from '../utils/helper';

interface GenericNodePort {
  name: string;
}

export class GenericNode extends GraphNode {
  private static readonly BORDER = 0.15;
  private static readonly WIDTH = 6;
  private static readonly HEIGHT = 3;
  private static readonly TEXT_PADDING = 0.2;
  private static readonly CIRCLE_RADIUS = 0.15;
  private static readonly PORT_PADDING = 0.25;

  private inputValueTextMeshes: MSDFFont[] = [];
  private outputValueTextMeshes: MSDFFont[] = [];

  public setOutputText(portNum, text) {
    const t = this.outputValueTextMeshes[portNum];
    t.text = text;
    // Align left
    t.position.setX(GenericNode.WIDTH - GenericNode.TEXT_PADDING - t.width);
  }

  public setOutputValue(portNum, value) {
    this.outputs[0].value = value;
    if(value === null) {
      this.setOutputText(0, "----------");
    } else {
      this.setOutputText(0, "0x" + byteToHex(value, 0));
    }
  }

  constructor(name: string, private inPort: GenericNodePort[], private outPort: GenericNodePort[], private globalUniforms, private computationFunction: (node: GenericNode) => void) {
    super(name);

    this.mainMesh = this.makeMainMesh();
    this.renderGroup.add(this.mainMesh);

    const textMesh = new MSDFFont(name, 1, new Color(0xffffff), GraphNode.FONT_SIZE, 'bold');
    // align center
    textMesh.position.setX(GenericNode.WIDTH / 2 - textMesh.width / 2);
    textMesh.position.setY(-GenericNode.TEXT_PADDING);
    this.renderGroup.add(textMesh);

    let y = -GenericNode.TEXT_PADDING * 2 - GraphNode.FONT_SIZE;
    inPort.forEach((port) => {
      const textMesh = new MSDFFont(port.name, 1, new Color(0xffffff), GraphNode.FONT_SIZE * 0.5);
      textMesh.position.setY(y);
      textMesh.position.setX(GenericNode.TEXT_PADDING);
      this.renderGroup.add(textMesh);

      y -= textMesh.fontSize;

      const valueTextMesh = new MSDFFont("----------", 1, new Color(0xffffff), GraphNode.FONT_SIZE * 0.8, 'regular', 'left', 'mono');
      valueTextMesh.position.setY(y);
      valueTextMesh.position.setX(GenericNode.TEXT_PADDING);
      this.renderGroup.add(valueTextMesh);
      this.inputValueTextMeshes.push(valueTextMesh);

      const inY = y - valueTextMesh.height / 2;
      const inX = -GenericNode.PORT_PADDING;

      const circle = new CircleGeometry(GenericNode.CIRCLE_RADIUS, 20);
      const mesh = new Mesh(circle, new MeshBasicMaterial({ color: new Color(0xffffff) }));
      mesh.position.setX(inX);
      mesh.position.setY(inY);
      this.renderGroup.add(mesh);

      this.inPos.push(new Vector3(inX, inY, 0));

      y -= valueTextMesh.fontSize;
    });

    y = -GenericNode.TEXT_PADDING * 2 - GraphNode.FONT_SIZE;
    outPort.forEach((port) => {
      const textMesh = new MSDFFont(port.name, 1, new Color(0xffffff), GraphNode.FONT_SIZE * 0.5, 'normal', 'right');
      textMesh.position.setY(y);
      textMesh.position.setX(GenericNode.WIDTH - GenericNode.TEXT_PADDING - textMesh.width);
      this.renderGroup.add(textMesh);

      y -= textMesh.fontSize;

      const valueTextMesh = new MSDFFont("----------", 1, new Color(0xffffff), GraphNode.FONT_SIZE * 0.8, 'regular', 'right', 'mono');
      valueTextMesh.position.setY(y);
      valueTextMesh.position.setX(GenericNode.WIDTH - GenericNode.TEXT_PADDING - valueTextMesh.width);
      this.renderGroup.add(valueTextMesh);
      this.outputValueTextMeshes.push(valueTextMesh);

      const outY = y - valueTextMesh.height / 2;
      const outX = GenericNode.WIDTH + GenericNode.PORT_PADDING;

      const circle = new CircleGeometry(GenericNode.CIRCLE_RADIUS, 20);
      const mesh = new Mesh(circle, new MeshBasicMaterial({ color: new Color(0xffffff) }));
      mesh.position.setX(outX);
      mesh.position.setY(outY);
      this.renderGroup.add(mesh);

      this.outPos.push(new Vector3(outX, outY, 0));

      y -= valueTextMesh.fontSize;

    });
  }

  protected onSetInputPortValue(portNum, value) {
    super.onSetInputPortValue(portNum, value);
    this.inputValueTextMeshes[portNum].text = "0x" + byteToHex(value, 8);
  }

  public compute() {
    super.compute();
    this.computationFunction(this);
  }

  private makeMainMesh() {
    const geometry = new BufferGeometry();

    const b = GenericNode.BORDER;
    const w = GenericNode.WIDTH;
    const h = GenericNode.HEIGHT;

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

    const loader = new TextureLoader();
    const backgroundTexture = loader.load(NODE_IMAGE);

    const mesh = new Mesh(geometry, new MarkerMaterial({
      color: new Color(0xffffff),
      globalUniforms: this.globalUniforms,
      map: backgroundTexture
    }));

    return mesh;
  }
}
