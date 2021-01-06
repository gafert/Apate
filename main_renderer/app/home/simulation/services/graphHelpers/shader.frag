precision highp float;

varying vec2 vUv;
varying float vPixelRatio;
varying float vAspectRatio;
varying float vPixelSizeRatio;
varying vec3 vNormal;
varying vec3 vCameraPosition;
varying vec3 vPosition;

uniform float u_width;
uniform float u_height;
uniform vec3 u_backgroundColor;
uniform vec3 u_borderColor;
uniform float u_time;
uniform vec2 u_resolution;

// gl_FragCoord.xy/u_resolution coordinates in screen


void main(){
  float edge = 0.0001;
  float width = 0.0005;
  float smoothness = 0.0001;

  edge = edge * (1.0 / vPixelRatio) * vPixelSizeRatio;
  width = width * (1.0 / vPixelRatio) * vPixelSizeRatio;
  smoothness = smoothness * (1.0 / vPixelRatio) * vPixelSizeRatio;

  vec2 edge_space = vec2(edge, edge * vAspectRatio);
  vec2 width_vec2 = vec2(width + edge, (width + edge) * vAspectRatio);
  vec2 smoothness_vec2 = vec2(smoothness + edge, (smoothness + edge) * vAspectRatio);
  vec2 smoothness_width_vec2 = vec2(smoothness + edge + width, (smoothness + edge + width) * vAspectRatio);

  vec2 st = vUv;
  vec3 color = vec3(0.0);

  // bottom-left
  vec2 bl = smoothstep(edge_space, smoothness_vec2, st);
  float pct = bl.x * bl.y;

  // top-right
  vec2 tr = smoothstep(edge_space, smoothness_vec2, 1.0-st);
  pct *= tr.x * tr.y;

  // bottom-left
  vec2 bl1 = smoothstep(width_vec2, smoothness_width_vec2, st);
  float pct1 = bl1.x * bl1.y;

  // top-right
  vec2 tr1 = smoothstep(width_vec2, smoothness_width_vec2, 1.0-st);
  pct1 *= tr1.x * tr1.y;

  pct1 = abs(1.0 - pct1);

  color = vec3(pct1 * pct);

  gl_FragColor = vec4(color * u_borderColor, 1.0) + vec4(u_backgroundColor, 1.0);
}
