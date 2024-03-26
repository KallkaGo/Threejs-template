uniform vec2 uResolution;
uniform sampler2D uTexture;
void main() {
  vec2 uv = gl_FragCoord.xy / uResolution;
  vec4 col = texture2D(uTexture, uv);
  gl_FragColor = col;

  #include <tonemapping_fragment>
	#include <colorspace_fragment>
}