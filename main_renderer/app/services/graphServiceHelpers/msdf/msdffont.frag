#version 300 es

#ifdef GL_OES_standard_derivatives
	#extension GL_OES_standard_derivatives : enable
#endif

precision highp float;

out highp vec4 pc_fragColor;
#define gl_FragColor pc_fragColor

uniform float opacity;
uniform vec3 color;
uniform sampler2D map;

in vec2 vUv;

float median(float r, float g, float b) {
    return max(min(r, g), min(max(r, g), b));
}

void main(void) {
    vec3 s = texture(map, vUv).rgb;
    float sigDist = median(s.r, s.g, s.b) - 0.5;
    float alpha = clamp(sigDist/fwidth(sigDist) + 0.5, 0.0, 1.0);

    gl_FragColor = vec4(color.xyz, alpha * opacity);
    if(alpha < 0.01)
        discard;
}
