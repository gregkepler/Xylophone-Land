import 'three'

export default class Wheel extends THREE.Mesh {

	constructor(position) {
		
		// make the pill geometry and extract
		var material = new THREE.MeshPhongMaterial( {
			color: new THREE.Color( 0xff0000 ),
			specular: new THREE.Color( 0xffffff ),
			shininess: 5.0
		} );
		var radius = 25.0;

		var wheelShape = new THREE.Shape();
		wheelShape.ellipse( 0.0, 0.0, radius, radius, Math.PI * -0.5, Math.PI * -2.5);

		var extrudeAmt = 15.0;
		var extrudeSettings = { amount: extrudeAmt, curveSegments: 128, bevelEnabled: true, bevelSegments: 16, steps: 5, bevelSize: 3.0, bevelThickness: 3.0 };
		var geometry = new THREE.ExtrudeGeometry( wheelShape, extrudeSettings );
		geometry.translate( position.x, position.y, position.z - (extrudeAmt * 0.5) );
		
		super( geometry, material );
		this.castShadow = true;
		this.receiveShadow = true;
	}
}