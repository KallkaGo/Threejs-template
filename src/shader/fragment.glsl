void main(){
    float distanceToCenter = distance(gl_PointCoord.xy, vec2(0.5));
    float strength = 1. / distanceToCenter - 2.;
    gl_FragColor = vec4(vec3(0.,0.,1.), strength);
}