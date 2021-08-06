#version 300 es
#define attribute in
#define varying out

#ifdef GL_OES_standard_derivatives
	#extension GL_OES_standard_derivatives : enable
#endif

in vec2 uv;
in vec3 position;
uniform mat4 projectionMatrix;
uniform mat4 modelViewMatrix;
out vec2 vUv;

void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}
