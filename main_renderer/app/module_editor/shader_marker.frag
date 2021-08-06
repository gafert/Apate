precision highp float;

varying vec2 vUv;
varying vec3 vPosition;

// MarkerMaterial
uniform vec3 color;
uniform float opacity;
uniform float highlight;
uniform vec3 greyColor;
uniform vec3 whiteColor;
uniform sampler2D map;

// Global uniforms
uniform float time;

#define AMPLITUDE 1.0
#define FREQ 2.0
#define SPEED 20.0
#define ONLYLIGHTEN 0.5

void main(){
  float s = sin((vPosition.x - vPosition.y - time * SPEED) / FREQ);
  s = 0.5 + s * 0.5; // Center between 0 and 1
  s =  pow(s, 2.0); // Make sin sharper
  s = s * AMPLITUDE; // How extreme the highlight should be
  s = ONLYLIGHTEN + s; // Move sin up from 0 to other value so sin never darkens to 0

  vec3 m = vec3(s);
  float a = step(length(color), 0.9); // Greyscale color
  // m = mix(((m - ONLYLIGHTEN) * 0.5) + 0.5, m, a); // If white add color
  m = mix(vec3(1.0), m, highlight); // Use sin if highlight

  vec3 outColor = m * color;

  gl_FragColor = texture2D(map, vUv) * vec4(mix(greyColor, outColor, opacity), 1.0);
}
