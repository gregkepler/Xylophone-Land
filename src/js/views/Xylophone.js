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
	}
}





class Shape extends THREE.Shape {
	constructor(props) {
		super(props);
	}

	arcTo(p1x, p1y, tx, ty, radius)
	{
		
		// Get current point.
		var p0 = this.currentPoint;
		var p1 = new THREE.Vector2(p1x, p1y);
		var t = new THREE.Vector2(tx, ty);
		console.log(p0, p1, t);
		
		// Calculate the tangent vectors tangent1 and tangent2.
		var p0t = (new THREE.Vector2()).subVectors(p0, t);
		var p1t = (new THREE.Vector2()).subVectors(p1, t);

		// Calculate tangent distance squares.
		var p0tSquare = p0t.lengthSq();
		var p1tSquare = p1t.lengthSq();

		// Calculate tan(a/2) where a is the angle between vectors tangent1 and tangent2.
		//
		// Use the following facts:
		//
		//  p0t * p1t  = |p0t| * |p1t| * cos(a) <=> cos(a) =  p0t * p1t  / (|p0t| * |p1t|)
		// |p0t x p1t| = |p0t| * |p1t| * sin(a) <=> sin(a) = |p0t x p1t| / (|p0t| * |p1t|)
		//
		// and
		//
		// tan(a/2) = sin(a) / ( 1 - cos(a) )

		var numerator = p0t.y * p1t.x - p1t.y * p0t.x;
		var denominator = Math.sqrt( p0tSquare * p1tSquare ) - ( p0t.x * p1t.x + p0t.y * p1t.y );

		// The denominator is zero <=> p0 and p1 are colinear.
		if( Math.abs( denominator ) < Number.EPSILON ) {
			this.lineTo( t.x, t.y );
		}
		else {
			// |b0 - t| = |b3 - t| = radius * tan(a/2).
			var distanceFromT = Math.abs( radius * numerator / denominator );

			// b0 = t + |b0 - t| * (p0 - t)/|p0 - t|.
			// const vec2 b0 = t + distanceFromT * normalize( p0t );
			var b0 = (new THREE.Vector2()).addVectors(t, p0t.clone().normalize().multiplyScalar(distanceFromT) );

			// If b0 deviates from p0, add a line to it.
			if( Math.abs(b0.x - p0.x) > Number.EPSILON || Math.abs(b0.y - p0.y) > Number.EPSILON ) {
				// this.lineTo( b0.x, b0.y );
			}

			// b3 = t + |b3 - t| * (p1 - t)/|p1 - t|.
			// const vec2 b3 = t + distanceFromT * normalize( p1t );
			var b3 = (new THREE.Vector2()).addVectors(t, p1t.clone().normalize().multiplyScalar(distanceFromT) );

			// The two bezier-control points are located on the tangents at a fraction
			// of the distance[ tangent points <-> tangent intersection ].
			// See "Approxmiation of a Cubic Bezier Curve by Circular Arcs and Vice Versa" by Aleksas Riskus
			// http://itc.ktu.lt/itc354/Riskus354.pdf

			var b0tSquare = (t.x - b0.x) *  (t.x - b0.x) + (t.y - b0.y) *  (t.y - b0.y);
			var radiusSquare = radius * radius;
			var fraction;

			// Assume dist = radius = 0 if the radius is very small.
			if( Math.abs( radiusSquare / b0tSquare ) < Number.EPSILON )
				fraction = 0.0;
			else
				fraction = ( 4.0 / 3.0 ) / ( 1.0 + Math.sqrt( 1.0 + b0tSquare / radiusSquare ) );

			// const vec2 b1 = b0 + fraction * (t - b0);
			// const vec2 b2 = b3 + fraction * (t - b3);
			var b1 = new THREE.Vector2().addVectors( b0, new THREE.Vector2().subVectors(t, b0).multiplyScalar( fraction) );
			var b2 = new THREE.Vector2().addVectors( b3, new THREE.Vector2().subVectors(t, b3).multiplyScalar( fraction) );

			// curveTo( b1, b2, b3 );
			this.bezierCurveTo( b1.x, b1.y, b2.x, b2.y, b3.x, b3.y );
		}
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
		this.position.set(maxWidth * -0.5, 0.0, 0.0);
	}

	render() {
		// return this.mesh;
	}
}