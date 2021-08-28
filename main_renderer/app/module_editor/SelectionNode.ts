import {BufferAttribute, BufferGeometry, Color, Mesh, TextureLoader} from 'three';
import {makeBox, setUVofVertex} from './3Dhelpers';
import NODE_IMAGE from './node.png';
import {MarkerMaterial} from './MarkerMaterial';
import {GraphNode} from './GraphNode';
import {MSDFFont} from '../services/graphServiceHelpers/msdf/MSDFFont';
import {byteToBinary, byteToHex} from '../utils/helper';

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
    if (from < 0) from = 0;
    if (to > 31) to = 31;
    if (to < from) to = from;

    const valueBytes = byteToBinary(value, 32);

    // Make new meshes

    from = Math.floor((from - 1) / 8) + from;
    to = Math.floor(to / 8) + to + 1;

    console.log(from, to);

    const left = valueBytes.substring(0, from);
    const center = valueBytes.substring(from, to);
    const right = valueBytes.substring(to, valueBytes.length);

    console.log('\'' + left + '\'', '\'' + center + '\'', '\'' + right + '\'');

    const textMeshLeft = new MSDFFont(left, 0.5, new Color(0xffffff), GraphNode.FONT_SIZE * 0.8, 'regular', 'left', 'mono');
    const textMeshCenter = new MSDFFont(center, 1, new Color(0xffffff), GraphNode.FONT_SIZE * 0.8, 'regular', 'left', 'mono');
    const textMeshRight = new MSDFFont(right, 0.5, new Color(0xffffff), GraphNode.FONT_SIZE * 0.8, 'regular', 'left', 'mono');


    const gl1 = textMeshLeft.geometry.layout.glyphs[textMeshLeft.geometry.layout.glyphs.length - 1];
    const gl2 = textMeshCenter.geometry.layout.glyphs[textMeshCenter.geometry.layout.glyphs.length - 1];

    const advance1 = (gl1 ? gl1.data.xadvance : 0) / textMeshLeft.getGlyphFontSize() * textMeshLeft.fontSize;
    const advance2 = (gl2 && textMeshRight.width !== 0 ? gl2.data.xadvance : 0) / textMeshCenter.getGlyphFontSize() * textMeshCenter.fontSize;

    const lastGlyphWidth1 = (gl1 ? gl1.data.width : 0) / textMeshLeft.getGlyphFontSize() * textMeshLeft.fontSize;
    const lastGlyphWidth2 = (gl2 && textMeshRight.width !== 0 ? gl2.data.width : 0) / textMeshCenter.getGlyphFontSize() * textMeshCenter.fontSize;

    const xoffset1 = (gl1 ? gl1.data.xoffset : 0) / textMeshLeft.getGlyphFontSize() * textMeshLeft.fontSize;
    const xoffset2 = (gl2 && textMeshRight.width !== 0 ? gl2.data.xoffset : 0) / textMeshCenter.getGlyphFontSize() * textMeshCenter.fontSize;

    const textWidth = textMeshLeft.width + textMeshCenter.width + textMeshRight.width + advance1 + advance2 - lastGlyphWidth1 - lastGlyphWidth2 - xoffset1 - xoffset2;
    const xPos = SelectionNode.WIDTH / 2 - textWidth / 2;
    const yPos = -SelectionNode.HEIGHT / 2 + Math.max(textMeshLeft.height, textMeshCenter.height) / 2; // Height is same for all, but could be 0 if the element has no text

    // align center
    textMeshLeft.position.setX(xPos);
    textMeshLeft.position.setY(yPos);
    // align center
    textMeshCenter.position.setX(xPos + textMeshLeft.width + advance1 - lastGlyphWidth1 - xoffset1);
    textMeshCenter.position.setY(yPos);
    // align center
    textMeshRight.position.setX(xPos + textMeshLeft.width + textMeshCenter.width + advance1 + advance2 - lastGlyphWidth1 - lastGlyphWidth2 - xoffset1 - xoffset2);
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
