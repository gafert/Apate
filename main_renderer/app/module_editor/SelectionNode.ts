import { BufferAttribute, BufferGeometry, Color, Mesh, TextureLoader } from 'three';
import { makeBox, setUVofVertex } from './3Dhelpers';
import NODE_IMAGE from './node.png';
import { MarkerMaterial } from './MarkerMaterial';
import { GraphNode } from './GraphNode';
import { MSDFFont } from '../services/graphServiceHelpers/msdf/MSDFFont';
import { byteToBinary, byteToHex } from '../utils/helper';

export class SelectionNode extends GraphNode {
  private static readonly BORDER = 0.15;
  private static readonly WIDTH = 9;
  private static readonly HEIGHT = 1;
  private static readonly TEXT_PADDING = 0.2;
  private static readonly CIRCLE_RADIUS = 0.15;
  private static readonly PORT_PADDING = 0.25;

  private inputValueTextMeshes: MSDFFont[] = [];
  private outputValueTextMeshes: MSDFFont[] = [];
  private textMeshes: MSDFFont[] = [];

  constructor(name: string, private globalUniforms) {
    super(name);

    this.mainMesh = this.makeMainMesh();
    this.renderGroup.add(this.mainMesh);

    this.createTextMesh(0xDEADBEEF, 10, 15);

    let counter = 1;
    let dir = 1;
    setInterval(() => {
      console.log('Text', counter);
      this.createTextMesh(0xDEADBEEF, counter, counter + 5);
      if (counter > 26) {
        dir = -1;
      } else if (counter <= 0) {
        dir = 1;
      }
      counter = counter + dir;
    }, 500);

  }

  public setOutputText(portNum, text) {
    const t = this.outputValueTextMeshes[portNum];
    t.text = text;
    // Align left
    t.position.setX(SelectionNode.WIDTH - SelectionNode.TEXT_PADDING - t.width);
  }

  public setOutputValue(portNum, value) {
    this.outputs[0].value = value;
    if (value === null) {
      this.setOutputText(0, '----------');
    } else {
      this.setOutputText(0, '0x' + byteToHex(value, 0));
    }
  }

  public createTextMesh(value: number, from, to) {

    const valueBytes = byteToBinary(value, 32);

    // Make new meshes

    from = Math.floor(from / 8) + from;
    to = Math.floor(to / 8) + to;

    console.log(from, to);

    const left = valueBytes.substring(0, from);
    const center = valueBytes.substring(from, to);
    const right = valueBytes.substring(to, valueBytes.length);

    console.log('\'' + left + '\'', '\'' + center + '\'', '\'' + right + '\'');

    const textMeshLeft = new MSDFFont(left, 0.5, new Color(0xffffff), GraphNode.FONT_SIZE * 0.8, 'regular', 'left', 'mono');
    const textMeshCenter = new MSDFFont(center, 1, new Color(0xffffff), GraphNode.FONT_SIZE * 0.8, 'regular', 'left', 'mono');
    const textMeshRight = new MSDFFont(right, 0.5, new Color(0xffffff), GraphNode.FONT_SIZE * 0.8, 'regular', 'left', 'mono');


    const textWidth = textMeshLeft.width + textMeshCenter.width + textMeshRight.width + 0.02 * 2;
    const xPos = SelectionNode.WIDTH / 2 - textWidth / 2;
    const yPos = -SelectionNode.HEIGHT / 2 + textMeshLeft.height / 2; // Height is same for all

    // align center
    textMeshLeft.position.setX(xPos);
    textMeshLeft.position.setY(yPos);
    // align center
    textMeshCenter.position.setX(xPos + textMeshLeft.width + 0.02);
    textMeshCenter.position.setY(yPos);
    // align center
    textMeshRight.position.setX(xPos + textMeshLeft.width + textMeshCenter.width + 0.02);
    textMeshRight.position.setY(yPos);

    // Remove old meshes
    this.renderGroup.remove(...this.textMeshes);

    this.textMeshes = [];
    this.textMeshes.push(textMeshLeft);
    this.textMeshes.push(textMeshCenter);
    this.textMeshes.push(textMeshRight);

    // Add new meshes
    this.renderGroup.add(...this.textMeshes);
  }

  public compute() {
    super.compute();
  }

  protected onSetInputPortValue(portNum, value) {
    super.onSetInputPortValue(portNum, value);
    this.inputValueTextMeshes[portNum].text = '0x' + byteToHex(value, 8);
  }

  private makeMainMesh() {
    const geometry = new BufferGeometry();

    const b = SelectionNode.BORDER;
    const w = SelectionNode.WIDTH;
    const h = SelectionNode.HEIGHT;

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
