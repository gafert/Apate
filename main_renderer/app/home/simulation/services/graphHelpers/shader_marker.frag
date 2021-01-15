precision highp float;

varying vec2 vUv;
varying vec3 vPosition;

// MarkerMaterial
uniform vec3 color;
uniform float opacity;
uniform float highlight;

// Global uniforms
uniform float time;

#define AMPLITUDE 1.0
#define FREQ 50.0
#define SPEED 400.0
#define ONLYLIGHTEN 0.7

void main(){
  float s = sin((vPosition.x - vPosition.y - time * SPEED) / FREQ);
  s = 0.5 + s * 0.5; // Center between 0 and 1
  s =  pow(s, 2.0); // Make sin sharper
  s = ONLYLIGHTEN + s; // Move sin up from 0 to other value so sin never darkens to 0
  s = s * AMPLITUDE; // How extreme the highlight should be
  s = mix(1.0, s, highlight); // Use sin

  vec3 outColor = s * color;

  gl_FragColor = vec4(outColor, opacity);
}
