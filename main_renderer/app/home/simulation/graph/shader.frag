precision highp float;

varying vec2 vUv;
varying float vPixelRatio;
varying float vAspectRatio;
varying float vPixelSizeRatio;

uniform float u_width;
uniform float u_height;
uniform vec3 u_backgroundColor;
uniform vec3 u_borderColor;
uniform float u_time;
uniform vec2 u_resolution;

// gl_FragCoord.xy/u_resolution coordinates in screen

void main() {
  float border_width = 0.000002;
  float maxX = 1.0 - (border_width * (vPixelSizeRatio / vPixelRatio));
  float minX = border_width * (vPixelSizeRatio / vPixelRatio);
  float maxY = 1.0 - (border_width * (vPixelSizeRatio / vPixelRatio) * vAspectRatio);
  float minY = border_width * (vPixelSizeRatio / vPixelRatio) * vAspectRatio;

  if (vUv.x < maxX && vUv.x > minX && vUv.y < maxY && vUv.y > minY) {
    gl_FragColor = vec4(u_backgroundColor, 1.0);
  } else {
    gl_FragColor = vec4(u_borderColor, 1.0);
  }
}

