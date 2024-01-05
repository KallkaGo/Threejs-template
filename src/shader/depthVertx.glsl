varying vec2 vZW;
varying vec2 vUv;
varying vec4 vScreenPos;
void main () {
    vec4 mvPosition = vec4(position, 1.0);
    mvPosition = modelViewMatrix * mvPosition;
    vScreenPos = projectionMatrix * mvPosition;
    gl_Position = vScreenPos;
    vZW = vScreenPos.zw;
    vUv = uv;
}
