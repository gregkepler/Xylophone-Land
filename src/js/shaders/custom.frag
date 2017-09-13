uniform vec2  iResolution;
uniform float iTime; 
uniform vec3  iColor;
uniform float iBlast;

varying vec2 vTexCoord;

void main() 
{
	// set texture coordinates (from center)
	vec2 uv = (vTexCoord * 2.0) - 1.0;
    uv.x *= iResolution.x / iResolution.y;
    vec2 texCoord = uv;

    // scale and morph the uv
    uv *= 100.0;
    uv *= sin((iTime * 0.5) - length(uv) );

    // calculate a morphed value, which will be used as the basis for the color
    float points = 5.0;
    float size 	 = 0.2 + sin(atan(uv.y, uv.x) * 5.0);
    float val 	 = smoothstep( 0.45, 0.65, fract(iTime * 0.25 - length(uv) + sin( atan(uv.y, uv.x) * points) * size));
    
	vec3 color1 = vec3( val );

	//calculate the blast color
	float t    = (iBlast * 1.1) - 0.1;		// offset so that we don't see any color at iBlast = 0.0
    float a    = abs(1.0 - pow(t, 2.0) );	// alpha of the blast fades as iBlast approaches 0
	vec3 color2 = mix(iColor, vec3(0.0), smoothstep( t, t + 0.02, length(texCoord) )) * a;
    
    // add the colors and fade out as we leave th center of the texture
    vec3 color = color1 + color2;
    color *= smoothstep( 0.85, 1.0, 1.0 - length(texCoord));
    gl_FragColor =  vec4( color,1.0);
}