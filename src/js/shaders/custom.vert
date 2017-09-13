varying vec2 vTexCoord;

void main() {
	vTexCoord = uv;
  	gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
}