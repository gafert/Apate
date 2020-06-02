precision highp float;

varying vec2 vUv;
varying vec3 vPos;

varying float vPixelRatio;
varying float vPixelSizeRatio;
varying float vAspectRatio;

uniform vec2 u_resolution;
uniform float u_width;
uniform float u_height;

void main () {
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  vPos = gl_Position.xyz;
  vUv = uv;
  vPixelSizeRatio = (cameraPosition.z - position.z);
  vPixelRatio = (u_width/u_resolution.x);
  vAspectRatio = u_width/u_height;
}
