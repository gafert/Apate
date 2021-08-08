import { MSDFMaterial } from './MSDFMaterial';
import { Color, DoubleSide, Material, Mesh, TextureLoader } from 'three';
import { TextGeometry } from './TextGeometry';
// Converts the ttf to a msdf font and packs it in the bundle
import robotoRegularFont from 'ttf-msdf-loader!../../../../bundled/fonts/Roboto/Roboto-Regular.ttf';
import robotoBoldFont from 'ttf-msdf-loader!../../../../bundled/fonts/Roboto/Roboto-Bold.ttf';

const { clipboard } = require('electron')
const nativeImage = require('electron').nativeImage

// console.log(robotoRegularFont);

const robotoRegularTexture = (new TextureLoader()).load(robotoRegularFont.textures[0]);
const robotoBoldTexture = (new TextureLoader()).load(robotoBoldFont.textures[0]);

// console.log('Bold\n%c ', 'font-size:400px; background:url(' + robotoBoldFont.textures[0] + ') no-repeat; background-size: contain; ');
// console.log('Regular\n%c ', 'font-size:400px; background:url(' + robotoRegularFont.textures[0] + ') no-repeat; background-size: contain; ');
clipboard.writeText(JSON.stringify(robotoRegularFont.font));

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
  'extra black': 950,
}

export class MSDFFont extends Mesh<TextGeometry, Material> {

  set text(value: string) {
    this._text = value;
    if(this.geometry) { // @ts-ignore
      this.geometry.update(this._text);
    }
  }

  constructor(public _text: string, opacity = 1, color = new Color(0xFFFFFF), fontSize = 12, fontWeight = 'normal') {
    super();

    let fontWeightNumeric;
    if(typeof fontWeight === 'string') {
      fontWeightNumeric = fontWeightMap[fontWeight];
    } else {
      fontWeightNumeric = fontWeight
    }

    let font, texture;
    if(fontWeightNumeric >= 100 && fontWeightNumeric <= 400) {
      font = robotoRegularFont.font;
      texture = robotoRegularTexture;
    } else {
      font = robotoBoldFont.font;
      texture = robotoBoldTexture;
    }


    this.geometry = new TextGeometry({
      text: this._text,
      align: 'left',
      font: font
    })

    this.material = new MSDFMaterial({
      map: texture,
      opacity: opacity,
      color: color,
      side: DoubleSide,
    });

    this.updateMorphTargets();

    this.scale.multiplyScalar(fontSize / 42);
  }
}
