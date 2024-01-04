#include "/node_modules/lygia/generative/curl.glsl"
#include "/node_modules/lygia/generative/cnoise.glsl"

uniform float uTime;
uniform float uProgress;

vec3 fbm(vec3 p) {
  vec3 value = p;
  float amplitude = .5;
  float frequency = 2.;
  float lacunarity = 2.;
  float persistance = .5;
  float scale = .5;
  int octaves = 1;

  for(int i = 0; i < octaves; i++) {
    vec3 noiseVal = curl(value * frequency * scale);
    value += amplitude * noiseVal;
    frequency *= lacunarity;
    amplitude *= persistance;
  }

  return value;
}

void main() {
  vec2 uv = gl_FragCoord.xy / resolution.xy;
  vec3 col = vec3(0.);
  vec3 pos = texture(texturePosition, uv).xyz;
  vec3 toPos = texture(toPosition,uv).xyz;
  pos = curl(pos);
  vec3 pos2 = texture(texturePosition, uv).xyz;
  pos2 = curl(pos2);
  pos2 = fbm(pos2);
  float mixFactor = 0.;
  mixFactor = cnoise(pos + uTime) * .5;
  col = mix(pos, pos2, mixFactor);
  gl_FragColor = vec4(col, 1.);
}
