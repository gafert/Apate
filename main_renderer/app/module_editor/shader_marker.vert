precision highp float;

varying vec2 vUv;
varying vec3 vPosition;

// MarkerMaterial
uniform vec3 color;
uniform float opacity;
uniform float highlight;
uniform vec3 greyColor;
uniform vec3 whiteColor;

// Global uniforms
uniform float time;

void main () {
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  vUv = uv;
  vPosition = (projectionMatrix * modelViewMatrix * vec4(position, 1.0)).xyz;
}
