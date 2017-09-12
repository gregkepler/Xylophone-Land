import 'three'
import Base from './Base'
import Wheel from './Wheel'

class Bar extends THREE.Mesh {
	constructor(scale, height, color) {
		
		// make the pill geometry and extract
		var material = new THREE.MeshPhongMaterial( {
								color: color,
								specular: new THREE.Color( 0xffffff ),
								shininess: 10.0
							} );

		var pillShape = new THREE.Shape();
		var w = 1.0;
		var h = height;
		var d = 0.1;
		var pillPts = [
			new THREE.Vector2(0.0, 0.0),			// 0 - ul corner control pt
			new THREE.Vector2(w * 0.5, 0.0 ),		// 1
			new THREE.Vector2(w * 1.0, 0.0 ),		// 2 - ur corner control pt
			new THREE.Vector2(w * 1.0, 0.5),	// 3
			new THREE.Vector2(w * 1.0, h - 0.5),	// 4
			new THREE.Vector2(w * 1.0, h ),	// 5 - br corner control pt
			new THREE.Vector2(w * 0.5, h ),	// 6
			new THREE.Vector2(0.0, h ),		// 7 - bl corner control pt
			new THREE.Vector2(0.0, h - 0.5),		// 8
			new THREE.Vector2(0.0, 0.5)		// 9
		]
		pillShape.moveTo( pillPts[1].x, pillPts[1].y );
		pillShape.quadraticCurveTo( pillPts[2].x, pillPts[2].y, pillPts[3].x, pillPts[3].y );
		pillShape.lineTo( pillPts[4].x, pillPts[4].y );
		pillShape.quadraticCurveTo( pillPts[5].x, pillPts[5].y, pillPts[6].x, pillPts[6].y );
		pillShape.quadraticCurveTo( pillPts[7].x, pillPts[7].y, pillPts[8].x, pillPts[8].y );
		pillShape.lineTo( pillPts[9].x, pillPts[9].y );
		pillShape.quadraticCurveTo( pillPts[0].x, pillPts[0].y, pillPts[1].x, pillPts[1].y );

		var extrudeSettings = { amount: 0.1, curveSegments: 64, bevelEnabled: true, bevelSegments: 16, steps: 1, bevelSize: 0.025, bevelThickness: 0.025 };
		var pillGeometry = new THREE.ExtrudeGeometry( pillShape, extrudeSettings );
		pillGeometry.translate( 0.0, h * -0.5, d * 0.5 );
		pillGeometry.scale(scale, scale, scale);
		pillGeometry.rotateX(Math.PI * 0.5);
		
		super( pillGeometry, material );
		this.castShadow = true;
		this.receiveShadow = true;
	}
}


var mix = (pt1, pt2, a) => {
	var p1 = pt1.clone().multiplyScalar(1.0 - a);
	var p2 = pt2.clone().multiplyScalar(a);
	return p1.add(p2);
}

export default class Xylophone extends THREE.Object3D {

	constructor(){
		super();
	}

	init(){		
		// add the bars
		const barCount = 8;
		const colors = [
			new THREE.Color( 0x1800F0 ),
			new THREE.Color( 0x026FE0 ),
			new THREE.Color( 0x00DCF5 ),
			new THREE.Color( 0x00DB29 ),
			new THREE.Color( 0xFFFA00 ),
			new THREE.Color( 0xFF8E00 ),
			new THREE.Color( 0xFF3D02 ),
			new THREE.Color( 0xC41400 )
		]

		var maxHeight = 0.0;
		var maxWidth = 0.0;
		var scale = 25.0;
		var minHeight = 2.0 * scale;
		for( var i = 0; i < barCount; i++ ){
			var color = new THREE.Color( 0xff0000 );
			var height = 2.0 + ((barCount - i) * 0.3);
			var bar = new Bar( scale, height, colors[i] );
			var x = (i) * 30.0;
			bar.translateX(x);
			maxHeight = Math.max(maxHeight, height * scale);
			maxWidth = Math.max(maxWidth, x + scale );
			this.add( bar );
		}

		// add base
		var baseGroup = new THREE.Group();
		var baseMesh = new Base(maxHeight, minHeight, maxWidth);
		var bounds = baseMesh.getBounds();
		baseGroup.add( baseMesh );

		// add wheels
		var wheel1Pos = mix(bounds.ul, bounds.ur, 0.2);
		var wheel1 = new Wheel( new THREE.Vector3(wheel1Pos.x, -55.0, wheel1Pos.y - 12.0) );
		baseGroup.add(wheel1);

		var wheel2Pos = mix(bounds.ul, bounds.ur, 0.8);
		var wheel2 = new Wheel( new THREE.Vector3(wheel2Pos.x, -55.0, wheel2Pos.y - 11.0) );
		baseGroup.add(wheel2);

		var wheel3Pos = mix(bounds.bl, bounds.br, 0.2);
		var wheel3 = new Wheel( new THREE.Vector3(wheel3Pos.x, -55.0, wheel3Pos.y + 12.0) );
		baseGroup.add(wheel3);

		var wheel4Pos = mix(bounds.bl, bounds.br, 0.8);
		var wheel4 = new Wheel( new THREE.Vector3(wheel4Pos.x, -55.0, wheel4Pos.y + 11.0) );
		baseGroup.add(wheel4);

		this.add(baseGroup);
		this.position.set(maxWidth * -0.5, 83.0, 0.0);
	}

	render() {
	}
}