import {MSDFMaterial} from './MSDFMaterial';
import {Color, DoubleSide, Material, Mesh, TextureLoader} from 'three';
import {TextGeometry} from './TextGeometry';
// Converts the ttf to a msdf font and packs it in the bundle
import robotoRegularFont from 'ttf-msdf-loader!../../../../bundled/fonts/Roboto/Roboto-Regular.ttf';
import robotoBoldFont from 'ttf-msdf-loader!../../../../bundled/fonts/Roboto/Roboto-Bold.ttf';
import robotoMonoRegularFont from 'ttf-msdf-loader!../../../../bundled/fonts/Roboto_Mono/RobotoMono-Regular.ttf';
import robotoMonoBoldFont from 'ttf-msdf-loader!../../../../bundled/fonts/Roboto_Mono/RobotoMono-Bold.ttf';

const { clipboard } = require('electron');
const nativeImage = require('electron').nativeImage;

// console.log(robotoRegularFont);

const robotoRegularTexture = (new TextureLoader()).load(robotoRegularFont.textures[0]);
const robotoBoldTexture = (new TextureLoader()).load(robotoBoldFont.textures[0]);
const robotoMonoRegularTexture = (new TextureLoader()).load(robotoMonoRegularFont.textures[0]);
const robotoMonoBoldTexture = (new TextureLoader()).load(robotoMonoBoldFont.textures[0]);



//console.log('Mono\n%c ', 'font-size:400px; background:url(' + robotoMonoRegularFont.textures[0] + ') no-repeat; background-size: contain; ');
console.log(robotoMonoRegularFont.font );
// console.log('Regular\n%c ', 'font-size:400px; background:url(' + robotoRegularFont.textures[0] + ') no-repeat; background-size: contain; ');
// clipboard.writeText(JSON.stringify(robotoRegularFont.font));

// https://developer.mozilla.org/en-US/docs/Web/CSS/font-weight#common_weight_name_mapping
const fontWeightMap = {
  'thin': 100,
  'hairline': 100,
  'extra light': 200,
  'ultra light': 200,
  'light': 300,
  'normal': 400,
  'regular': 400,
  'medium': 500,
  'semi bold': 600,
  'demi bold': 600,
  'bold': 700,
  'extra bold': 800,
  'ultra bold': 800,
  'black': 900,
  'heavy': 900,
  'ultra black': 950,
  'extra black': 950
};

export class MSDFFont extends Mesh<TextGeometry, Material> {

  constructor(private _text: string, opacity = 1, color: Color = new Color(0xFFFFFF), public fontSize = 12, fontWeight = 'normal', align: 'left' | 'right' | 'center' = 'left', fontType: 'mono' | 'regular' = 'regular', mode = 'pre') {
    super();

    let fontWeightNumeric;
    if (typeof fontWeight === 'string') {
      fontWeightNumeric = fontWeightMap[fontWeight];
    } else {
      fontWeightNumeric = fontWeight;
    }

    let font, texture;
    if (fontWeightNumeric >= 100 && fontWeightNumeric <= 400) {
      font = fontType == 'mono' ? robotoMonoRegularFont.font : robotoRegularFont.font;
      texture = fontType == 'mono' ? robotoMonoRegularTexture : robotoRegularTexture;
    } else {
      font = fontType == 'mono' ? robotoMonoBoldFont.font : robotoBoldFont.font;
      texture = fontType == 'mono' ? robotoMonoBoldTexture : robotoBoldTexture;
    }

    this.geometry = new TextGeometry({
      text: this._text,
      align: align,
      font: font,
      mode: mode
    });

    this.material = new MSDFMaterial({
      map: texture,
      opacity: opacity,
      color: color,
      side: DoubleSide
    });

    this.updateMorphTargets();

    this.scale.multiplyScalar(fontSize / this.getGlyphFontSize()); // 42 is set when generating the font by webpack
  }

  public getCharWidth(index = 0) {
    console.log(this.geometry.visibleGlyphs)
    return this.geometry.visibleGlyphs[index].data.xadvance / this.getGlyphFontSize() * this.fontSize;
  }

  public get height() {
    return this.geometry.layout.height / this.getGlyphFontSize() * this.fontSize;
  }

  public get width() {
    return this.geometry.layout.width / this.getGlyphFontSize() * this.fontSize;
  }

  public getGlyphFontSize() {
    return this.geometry.layout.opt.font.info.size
  }

  public get text() {
    return this._text;
  }

  public set text(value: string) {
    this._text = value;
    if (this.geometry) { // @ts-ignore
      this.geometry.update(this._text);
    }
  }

  public dispose() {
    this.geometry.dispose();
    this.material.dispose();
  }
}
