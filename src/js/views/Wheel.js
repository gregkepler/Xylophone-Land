"use strict";

import 'three';

const WHEEL_RADIUS = 25.0;
const WHEEL_EXTRUDE = 15.0;

export default class Wheel extends THREE.Mesh {

	constructor(position) {
		
		// make the wheel geometry and extrude
		let material = new THREE.MeshPhongMaterial( {
			color: new THREE.Color( 0xff0000 ),
			specular: new THREE.Color( 0xffffff ),
			shininess: 5.0
		} );
		
		let wheelShape = new THREE.Shape();
		wheelShape.ellipse( 0.0, 0.0, WHEEL_RADIUS, WHEEL_RADIUS, Math.PI * -0.5, Math.PI * -2.5);

		let extrudeSettings = { amount: WHEEL_EXTRUDE, curveSegments: 128, bevelEnabled: true, bevelSegments: 16, steps: 5, bevelSize: 3.0, bevelThickness: 3.0 };
		let geometry = new THREE.ExtrudeGeometry( wheelShape, extrudeSettings );
		geometry.translate( position.x, position.y, position.z - (WHEEL_EXTRUDE * 0.5) );
		
		super( geometry, material );
		this.castShadow = true;
		this.receiveShadow = true;
	}
}