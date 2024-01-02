uniform float uPointSize;
uniform float uPixelRatio;

uniform sampler2D texturePosition;
uniform float uProgress;

attribute vec2 reference;
attribute vec3 toPos;

void main() {
    vec3 p = texture(texturePosition, reference).xyz;
    vec3 dis = toPos - p;
    float percent = uProgress;
    vec3 pos;
    if(percent < 1.) {
        pos = p + dis * percent;
    } else {
        pos = toPos;
    }

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.);

    gl_PointSize = uPointSize * uPixelRatio;
}