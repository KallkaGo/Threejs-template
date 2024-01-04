uniform vec3 uColor;
void main(){
    float distanceToCenter = distance(gl_PointCoord.xy, vec2(0.5));
    float strength = 0.05 / distanceToCenter - .1;
    gl_FragColor = vec4(uColor, strength);
}