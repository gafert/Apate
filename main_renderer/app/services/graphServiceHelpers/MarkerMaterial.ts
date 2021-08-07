import { Color, RawShaderMaterial, ShaderMaterial, ShaderMaterialParameters } from 'three';
import SHADER_MARKER_VERT from './shader_marker.vert';
import SHADER_MARKER_FRAG from './shader_marker.frag';
import { readStyleProperty } from '../../utils/helper';

interface MarkerMaterialParameters extends ShaderMaterialParameters {
  // opacity: number; // --> already in super
  globalUniforms: any; // Cannot be named uniforms because that would overwrite the set uniforms
  color?: Color;
  highlight?: number;
}

/**
 * MarkerMaterial, works like Basic Material but can highlight elements.
 * Needs to use prototypes and not classes to inherit Material correctly.
 * @param parameters
 * @constructor
 */
export class MarkerMaterial extends RawShaderMaterial {

  public isMarkerMaterial = true;

  public get color() {
    return this.uniforms.color.value;
  }
  public set color(v) {
    this.uniforms.color.value = v;
  }
  public get highlight() {
    return this.uniforms.highlight.value;
  }
  public set highlight(v) {
    this.uniforms.highlight.value = v;
  }
  // @ts-ignore
  public get opacity() {
    return this.uniforms?.opacity?.value;
  }
  public set opacity(v) {
    if (this.uniforms)
      this.uniforms.opacity.value = v;
  }


  constructor(parameters: MarkerMaterialParameters) {
    super();

    this.uniforms = {
      ...parameters.globalUniforms,
      color: { value: parameters.color ? parameters.color : new Color(0xffffff) },
      opacity: { value: parameters.opacity ? parameters.opacity : 1 },
      highlight: { value: parameters.highlight ? parameters.highlight : 0 },
      greyColor: { value: new Color(readStyleProperty('grey2')) },
      whiteColor: { value: new Color(readStyleProperty('accent')) },
    };

    this.vertexShader = SHADER_MARKER_VERT;
    this.fragmentShader = SHADER_MARKER_FRAG;
    this.transparent = false;
  }
}