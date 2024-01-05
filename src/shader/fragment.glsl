varying vec2 vZW;
varying vec4 vScreenPos;
varying vec2 vUv;
uniform float uFar;
uniform float uNear;
uniform sampler2D depthTex;
uniform sampler2D noiseTex;
uniform float uTime;

#include <packing>
float zNDCToZView(float zNDC) {
  float zView = (2.0 * uFar * uNear) / (zNDC * (uFar - uNear) - (uFar + uNear));
  return -zView;
}

void main() {
  float z = vZW.x / vZW.y;
  float depth = zNDCToZView(z);
  vec3 screenPos = vScreenPos.xyz / vScreenPos.w;
  screenPos = screenPos * 0.5 + 0.5;

  float depthSample = unpackRGBAToDepth(texture(depthTex, screenPos.xy));
  float sceneDepth = depthSample * (uFar - uNear) + uNear;
  float diff = sceneDepth - depth;
  float waterDiff01 = clamp(diff / 0.8, 0.0, 1.0);
  float foamDiff01 = clamp(diff / 0.1, 0.0, 1.0);

  vec3 depthColor = vec3(0.0, 0.0, 0.5);
  vec3 shallowColor = vec3(0.0, 0.8, 1.0);

  vec3 waterColor = mix(shallowColor, depthColor, waterDiff01);

  vec2 noiseUV = vUv * vec2(10.0, 8.0) + uTime * 0.02;

  float noise = texture(noiseTex, noiseUV).r;

  float noiseCutoff = 1.;
  noiseCutoff *= foamDiff01;
  float surfaceNoise = noise > noiseCutoff ? 1.0 : 0.0;

  vec3 foamColor = vec3(.8) * surfaceNoise;
  vec3 color = waterColor + foamColor;
  gl_FragColor = vec4(color, 1.0);
}