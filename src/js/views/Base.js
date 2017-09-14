"use strict";

import 'three';

// Return an object that defines the shape of the base
function getBaseBounds( minHeight, maxHeight, width, expansion ) {
	
	let baseRatio 		= minHeight / maxHeight;
	let baseHeight 		= maxHeight + expansion;
	let baseMinHeight 	= ( maxHeight * baseRatio ) + expansion;
	let baseWidth 		= width + expansion * 0.5;
	let ul = new THREE.Vector2( expansion * -0.5,  baseHeight * -0.5 );
	let ur = new THREE.Vector2( baseWidth,  baseMinHeight * -0.5 );
	let bl = new THREE.Vector2( expansion * -0.5, baseHeight * 0.5 );
	let br = new THREE.Vector2( baseWidth,  baseMinHeight * 0.5 );

	return {
		ul: ul, ur: ur, bl: bl, br: br,
		topAngle: new THREE.Vector2().subVectors( ur, ul ).normalize(),
		bottomAngle: new THREE.Vector2().subVectors( br, bl ).normalize()
	};
};

// Create a Shape object using a base bounds object definition
function makeBaseShape( baseBounds ) {

	let round  = 30.0;
	let ul = baseBounds.ul, ur = baseBounds.ur, bl = baseBounds.bl, br = baseBounds.br;
	let angle1 = baseBounds.topAngle;
	let angle2 = baseBounds.bottomAngle;
	let pt1 = ( new THREE.Vector2() ).addVectors( ul, new THREE.Vector2( round, round * angle1.y) );
	let pt2 = ( new THREE.Vector2() ).subVectors( ur, new THREE.Vector2( round, round * -angle1.y) );
	let pt3 = ( new THREE.Vector2() ).addVectors( ur, new THREE.Vector2( 0.0, round ) );
	let pt4 = ( new THREE.Vector2() ).subVectors( br, new THREE.Vector2( 0.0, round ) );
	let pt5 = ( new THREE.Vector2() ).subVectors( br, new THREE.Vector2( round, round * -angle2.y ) );
	let pt6 = ( new THREE.Vector2() ).addVectors( bl, new THREE.Vector2( round, round * angle2.y ) );
	let pt7 = ( new THREE.Vector2() ).subVectors( bl, new THREE.Vector2( 0.0, round ) );
	let pt8 = ( new THREE.Vector2() ).addVectors( ul, new THREE.Vector2( 0.0, round ) );

	let baseBottomShape = new THREE.Shape();
	baseBottomShape.moveTo( pt1.x, pt1.y );
	baseBottomShape.lineTo( pt2.x, pt2.y );
	baseBottomShape.quadraticCurveTo( ur.x, ur.y + round * 0.25, pt3.x, pt3.y );
	baseBottomShape.lineTo( pt4.x, pt4.y );
	baseBottomShape.quadraticCurveTo( br.x, br.y - round * 0.25, pt5.x, pt5.y );
	baseBottomShape.lineTo( pt6.x, pt6.y );
	baseBottomShape.quadraticCurveTo( bl.x, bl.y, pt7.x, pt7.y );
	baseBottomShape.lineTo( pt8.x, pt8.y );
	baseBottomShape.quadraticCurveTo( ul.x, ul.y, pt1.x, pt1.y );
	return baseBottomShape;
};


export default class Base extends THREE.Mesh 
{
	constructor( maxHeight, minHeight, width ) {

		// add the base
		let topBaseBounds 	 = getBaseBounds( minHeight, maxHeight, width, 20.0 );
		let bottomBaseBounds = getBaseBounds( minHeight, maxHeight, width, 17.0 );
		let baseTopShape 	 = makeBaseShape( topBaseBounds );
		let baseBottomShape  = makeBaseShape( bottomBaseBounds );
		
		let material = new THREE.MeshPhongMaterial( {
			color: new THREE.Color( 0xeeeeee ),
			specular: new THREE.Color( 0xeeeeee ),
			shininess: 5.0
		} );

		// create the 2 meshes that make the base
		let extrudeSettings = { amount: 8.0, curveSegments: 64, bevelEnabled: true, bevelSegments: 16, steps: 1, bevelSize: 5.0, bevelThickness: 5.0 };
		let baseGeometry = new THREE.ExtrudeGeometry( baseTopShape, extrudeSettings );
		baseGeometry.rotateX(Math.PI * 0.5);
		baseGeometry.translate( 0, -15.0, 0.0 );

		let extrude2Settings = { amount: 30.0, curveSegments: 64, bevelEnabled: true, bevelSegments: 16, steps: 1, bevelSize: 5.0, bevelThickness: 5.0 };
		let baseBotGeometry = new THREE.ExtrudeGeometry( baseBottomShape, extrude2Settings );
		baseBotGeometry.rotateX(Math.PI * 0.5);
		baseBotGeometry.translate( 0, -20.0, 0.0 );

		baseGeometry.merge( baseBotGeometry );

		super(baseGeometry, material);
		this.baseBounds = topBaseBounds;
		this.castShadow = true;
		this.receiveShadow = true;
	}

	getBounds(){
		return this.baseBounds;
	}

}