import {Color} from 'three';
import {GraphNode} from './GraphNode';
import {MSDFFont} from '../services/graphServiceHelpers/msdf/MSDFFont';
import {byteToBinary, byteToHex} from '../utils/helper';
import {makeNinePatch} from "./NinePatch";

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

    this.mainMesh = makeNinePatch(SelectionNode.WIDTH, SelectionNode.HEIGHT, SelectionNode.BORDER);
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

    const fromTextPos = Math.floor((from - 1) / 8) + from;
    const toTextPos = Math.floor(to / 8) + to + 1;


    const left = valueBytes.substring(0, fromTextPos);
    const center = valueBytes.substring(fromTextPos, toTextPos);
    const right = valueBytes.substring(toTextPos, valueBytes.length);

    console.log('\'' + left + '\'', '\'' + center + '\'', '\'' + right + '\'');

    const textMeshLeft = new MSDFFont(left, 0.5, new Color(0xffffff), GraphNode.FONT_SIZE * 0.8, 'regular', 'left', 'mono');
    const textMeshCenter = new MSDFFont(center, 1, new Color(0xffffff), GraphNode.FONT_SIZE * 0.8, 'regular', 'left', 'mono');
    const textMeshRight = new MSDFFont(right, 0.5, new Color(0xffffff), GraphNode.FONT_SIZE * 0.8, 'regular', 'left', 'mono');

    const centerFirstGlyph = textMeshCenter.geometry.layout.glyphs[0];
    const leftLastGlyph = textMeshLeft.geometry.layout.glyphs[textMeshLeft.geometry.layout.glyphs.length - 1];
    const centerLastGlyph = textMeshCenter.geometry.layout.glyphs[textMeshCenter.geometry.layout.glyphs.length - 1];

    const leftLastGlyphAdvance = (leftLastGlyph ? leftLastGlyph.data.xadvance : 0) / textMeshLeft.getGlyphFontSize() * textMeshLeft.fontSize;
    const centerLastGlyphAdvance = (centerLastGlyph  ? centerLastGlyph.data.xadvance : 0) / textMeshCenter.getGlyphFontSize() * textMeshCenter.fontSize;
    const centerFirstGlyphAdvance = (centerFirstGlyph ? centerFirstGlyph.data.xadvance : 0) / textMeshCenter.getGlyphFontSize() * textMeshCenter.fontSize;

    const leftLastGlyphWidth = (leftLastGlyph ? leftLastGlyph.data.width : 0) / textMeshLeft.getGlyphFontSize() * textMeshLeft.fontSize;
    const centerLastGlyphWidth = (centerLastGlyph ? centerLastGlyph.data.width : 0) / textMeshCenter.getGlyphFontSize() * textMeshCenter.fontSize;

    const leftLastGlyphWidthXOffset = (leftLastGlyph ? leftLastGlyph.data.xoffset : 0) / textMeshLeft.getGlyphFontSize() * textMeshLeft.fontSize;
    const centerLastGlyphWidthXOffset = (centerLastGlyph  ? centerLastGlyph.data.xoffset : 0) / textMeshCenter.getGlyphFontSize() * textMeshCenter.fontSize;

    const textWidth =
      textMeshLeft.width
      + textMeshCenter.width
      + textMeshRight.width
      + leftLastGlyphAdvance
      - leftLastGlyphWidthXOffset
      - leftLastGlyphWidth
      + (textMeshRight.width !== 0 ? (centerLastGlyphAdvance // Ignore last element if there is no right element
        - centerLastGlyphWidthXOffset
        - centerLastGlyphWidth) : 0);

    const xPos = SelectionNode.WIDTH / 2 - textWidth / 2;
    let yPos = -SelectionNode.HEIGHT / 2 + Math.max(textMeshLeft.height, textMeshCenter.height) / 2; // Height is same for all, but could be 0 if the element has no text

    // align center
    textMeshLeft.position.setX(xPos);
    textMeshLeft.position.setY(yPos);
    // align center
    textMeshCenter.position.setX(xPos + textMeshLeft.width + leftLastGlyphAdvance - leftLastGlyphWidth - leftLastGlyphWidthXOffset);
    textMeshCenter.position.setY(yPos);
    // align center
    textMeshRight.position.setX(xPos + textMeshLeft.width + textMeshCenter.width + leftLastGlyphAdvance + centerLastGlyphAdvance - leftLastGlyphWidth - centerLastGlyphWidth - leftLastGlyphWidthXOffset - centerLastGlyphWidthXOffset);
    textMeshRight.position.setY(yPos);


    // Bit numbers

    const leftBitNumber = new MSDFFont(from.toString(), 1, new Color(0xffffff), GraphNode.FONT_SIZE * 0.3, 'regular', 'left', 'mono');
    yPos += leftBitNumber.height

    leftBitNumber.position.setX(xPos + textMeshLeft.width + leftLastGlyphAdvance - leftLastGlyphWidth - leftLastGlyphWidthXOffset + (from !== 0 && from % 8 === 0 ? centerFirstGlyphAdvance : 0));
    leftBitNumber.position.setY(yPos);

    // Do not add second bit number if we dont need to
    let rightBitNumber;
    if(from !== to) {
      rightBitNumber = new MSDFFont(to.toString(), 1, new Color(0xffffff), GraphNode.FONT_SIZE * 0.3, 'regular', 'left', 'mono');
      rightBitNumber.position.setX(xPos + textMeshLeft.width + textMeshCenter.width + leftLastGlyphAdvance - leftLastGlyphWidth - centerLastGlyphWidth - leftLastGlyphWidthXOffset);
      rightBitNumber.position.setY(yPos);
    }


    // Remove old meshes
    this.renderGroup.remove(...this.textMeshes);

    // Be sure to dispose all old meshes
    this.textMeshes.forEach((t) => {
      t.dispose();
    })

    this.textMeshes = [];

    (from <= 0) ? textMeshLeft.dispose() : this.textMeshes.push(textMeshLeft);
    (to >= 31) ? textMeshRight.dispose() : this.textMeshes.push(textMeshRight);

    this.textMeshes.push(textMeshCenter);

    this.textMeshes.push(leftBitNumber);

    // Do not add second bit number if we dont need to
    if(from !== to)
      this.textMeshes.push(rightBitNumber);

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
}
