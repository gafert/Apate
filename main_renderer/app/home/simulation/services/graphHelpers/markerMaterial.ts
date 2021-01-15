import { Color, ShaderMaterial, ShaderMaterialParameters } from 'three';
import SHADER_MARKER_VERT from './shader_marker.vert';
import SHADER_MARKER_FRAG from './shader_marker.frag';

interface MarkerMaterialParameters extends ShaderMaterialParameters {
  // opacity: number; --> already in super
  globalUniforms: any; // Cannot be named uniforms because that would overwrite the set uniforms
  color: Color;
}

/**
 * MarkerMaterial, works like Basic Material but can highlight elements.
 * Needs to use prototypes and not classes to inherit Material correctly.
 * @param parameters
 * @constructor
 */
function MarkerMaterial(parameters: MarkerMaterialParameters) {
  ShaderMaterial.call(this, {
    uniforms: {
      ...parameters.globalUniforms,
      color: { value: new Color(1, 0.7, 0.7) },
      opacity: { value: 1 },
      highlight: { value: 0 }
    },
    vertexShader: SHADER_MARKER_VERT,
    fragmentShader: SHADER_MARKER_FRAG,
    transparent: true
  });

  Object.defineProperties(this, {
    color: {
      enumerable: true,
      get: () => {
        return this.uniforms.color.value;
      },
      set: (value) => {
        this.uniforms.color.value = value;
      }
    },
    opacity: {
      enumerable: true,
      get: () => {
        return this.uniforms.opacity.value;
      },
      set: (value) => {
        this.uniforms.opacity.value = value;
      }
    },
    highlight: {
      enumerable: true,
      get: () => {
        return this.uniforms.highlight.value;
      },
      set: (value) => {
        this.uniforms.highlight.value = value;
      }
    }
  });

  // Dont set globalUniforms because its not a member of this material
  this.setValues({ color: parameters.color, opacity: parameters.opacity });
}

MarkerMaterial.prototype = Object.create(ShaderMaterial.prototype);
MarkerMaterial.prototype.constructor = MarkerMaterial;
MarkerMaterial.prototype.isMarkerMaterial = true;
MarkerMaterial.prototype.type = 'MarkerMaterial';

export { MarkerMaterial };
