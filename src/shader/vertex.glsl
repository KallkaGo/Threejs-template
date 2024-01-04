uniform float uPointSize;
uniform float uPixelRatio;
uniform float uRadius;
uniform sampler2D texturePosition;
uniform sampler2D toPosition;
uniform float uProgress;
uniform float uTime;
attribute vec2 reference;


void main() {
  vec3 p = texture(texturePosition, reference).xyz;
  vec3 toPos = texture(toPosition, reference).xyz;
  vec3 dis = toPos - p;
  float percent = uProgress;
  vec3 pos;

  pos = p + vec3(sin(uTime * 10.) * uRadius, uTime, cos(uTime * 10.) * uRadius);

  pos = pos + dis * percent;

  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.);

  gl_PointSize = uPointSize * uPixelRatio;
}