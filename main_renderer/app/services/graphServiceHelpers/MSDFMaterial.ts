import {Color, RawShaderMaterial, ShaderMaterial, ShaderMaterialParameters, Texture} from "three";

interface MSDFMaterialParameters extends ShaderMaterialParameters {
  // opacity: number; --> already in super
  color: Color;
  negate?: boolean;
  map: Texture;
}

function MSDFMaterial(parameters: MSDFMaterialParameters) {
  parameters.precision = parameters.precision || 'highp';
  parameters.alphaTest = parameters.alphaTest || 0.00001;
  parameters.negate = parameters.negate || false;
  parameters.transparent = parameters.transparent || true;
  parameters.opacity = parameters.opacity || 1;

  // Remove non existent values of super to prevent warnings
  const copy = Object.assign({}, parameters);
  delete copy.map;
  delete copy.negate;
  delete copy.color;

  RawShaderMaterial.call(this, {...copy, ...{
    uniforms: {
      color: { value: parameters.color },
      opacity: { value: parameters.opacity },
      map: { value: parameters.map},
    },
    vertexShader: '#version 300 es\n' + ['in vec2 uv;', 'in vec4 position;', 'uniform mat4 projectionMatrix;', 'uniform mat4 modelViewMatrix;', 'out vec2 vUv;', 'void main() {', 'vUv = uv;', 'gl_Position = projectionMatrix * modelViewMatrix * position;', '}'].join('\n'),
    fragmentShader: ['#version 300 es', '#ifdef GL_OES_standard_derivatives', '#extension GL_OES_standard_derivatives : enable', '#endif', 'precision ' + parameters.precision + ' float;', 'uniform float opacity;', 'uniform vec3 color;', 'uniform sampler2D map;', 'in vec2 vUv;', 'out vec4 myOutputColor;', 'float median(float r, float g, float b) {', ' return max(min(r, g), min(max(r, g), b));', '}', 'void main() {', ' vec3 s = ' + (parameters.negate ? '1.0 - ' : '') + 'texture(map, vUv).rgb;', ' float sigDist = median(s.r, s.g, s.b) - 0.5;', ' float alpha = clamp(sigDist/fwidth(sigDist) + 0.5, 0.0, 1.0);', ' myOutputColor = vec4(color.xyz, alpha * opacity);', parameters.alphaTest === 0 ? '' : ' if (myOutputColor.a < ' + parameters.alphaTest + ') discard;', '}'].join('\n')
  }});

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
    }
  });
}

MSDFMaterial.prototype = Object.create(RawShaderMaterial.prototype);
MSDFMaterial.prototype.constructor = MSDFMaterial;
MSDFMaterial.prototype.isMSDFMaterial = true;
MSDFMaterial.prototype.type = 'MSDFMaterial';

export { MSDFMaterial };
