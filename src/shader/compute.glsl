uniform sampler2D texturePosition;
void main(){
    vec2 uv=gl_FragCoord.xy/resolution.xy;
    vec3 pos=texture(texturePosition,uv).xyz;
    gl_FragColor=vec4(pos,1.);
}

