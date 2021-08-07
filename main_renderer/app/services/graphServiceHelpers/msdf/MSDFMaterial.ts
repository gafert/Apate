import { Color, RawShaderMaterial, ShaderMaterialParameters, Texture } from "three";
import MSDF_FRAG_SHADER from "./msdffont.frag"
import MSDF_VERT_SHADER from "./msdffont.vert"

interface MSDFMaterialParameters extends ShaderMaterialParameters {
  // opacity: number; --> already in super
  color: Color;
  map: Texture;
}

export class MSDFMaterial extends RawShaderMaterial {

  // @ts-ignore
  public get opacity() {
    return this.uniforms?.opacity?.value;
  }
  public set opacity(v) {
    if (this.uniforms)
      this.uniforms.opacity.value = v;
  }

  public get color() {
    return this.uniforms.color.value;
  }
  public set color(v) {
    this.uniforms.color.value = v;
  }

  constructor(parameters: MSDFMaterialParameters) {
    super();

    this.uniforms = {
      color: { value: parameters.color ? parameters.color : new Color(0xffffff) },
      opacity: { value: parameters.opacity ? parameters.opacity : 1 },
      map: { value: parameters.map },
    };

    this.vertexShader = MSDF_VERT_SHADER;
    this.fragmentShader = MSDF_FRAG_SHADER;
    this.transparent = true;
  }
} 
