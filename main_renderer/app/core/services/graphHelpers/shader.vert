precision highp float;

varying vec2 vUv;
varying float vPixelRatio;
varying float vPixelSizeRatio;
varying float vAspectRatio;
varying vec3 vNormal;
varying vec3 vCameraPosition;
varying vec3 vPosition;

uniform vec2 u_resolution;
uniform float u_width;
uniform float u_height;

void main () {
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  vUv = uv;
  vNormal = normal;
  vPosition = (projectionMatrix * modelViewMatrix * vec4(position, 1.0)).xyz;

  vCameraPosition = cameraPosition;
  vPixelSizeRatio = (cameraPosition.z - position.z) / 200.0 + 1.0;
  vPixelRatio = (u_width/u_resolution.x);
  vAspectRatio = u_width/u_height;
}
