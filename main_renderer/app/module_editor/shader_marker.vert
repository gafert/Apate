#version 300 es

precision highp float;

in vec2 uv;
in vec3 position;
uniform mat4 projectionMatrix;
uniform mat4 modelViewMatrix;

out vec2 vUv;
out vec3 vPosition;

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
