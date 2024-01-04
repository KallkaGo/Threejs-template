void main() {
  vec2 uv = gl_FragCoord.xy / resolution.xy;
  vec3 toPos = texture(toPosition,uv).xyz;
  gl_FragColor = vec4(toPos, 1.);
}
