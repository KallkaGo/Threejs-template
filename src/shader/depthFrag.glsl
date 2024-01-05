varying vec2 vZW;
uniform float uFar;
uniform float uNear;

#include <packing>
float zNDCToZ01(float zNDC) {
    float zView = (2.0 * uFar * uNear) / (zNDC * (uFar - uNear) - (uFar + uNear));
    float z01 = (zView + uNear) / (uFar - uNear);
    return -z01;
}

void main () {
    float z = vZW.x / vZW.y;

    float colorZ = zNDCToZ01(z);
    // colorZ = pow(colorZ, 1.0 / 2.2);
    gl_FragColor = packDepthToRGBA(colorZ);
}