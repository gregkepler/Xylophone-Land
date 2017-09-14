"use strict";

import 'three';
import Base from './Base';
import Wheel from './Wheel';
import * as utils from '../utils';

const GLOW_DUR = 2.0;    // duration of the bar glow

class Bar extends THREE.Mesh {

    constructor(name, scale, height, settings) {   
        // define material
        let color = settings.color;
        let material = new THREE.MeshPhongMaterial( {
            color: color,
            specular: new THREE.Color( 0xffffff ),
            shininess: 10.0
        } );

        // define pill shape
        let pillShape = new THREE.Shape();
        let w = 1.0;
        let h = height;
        let d = 0.1;
        let pillPts = [
            new THREE.Vector2( 0.0, 0.0 ),           // 0 - ul corner control pt
            new THREE.Vector2( w * 0.5, 0.0 ),       // 1
            new THREE.Vector2( w * 1.0, 0.0 ),       // 2 - ur corner control pt
            new THREE.Vector2( w * 1.0, 0.5),        // 3
            new THREE.Vector2( w * 1.0, h - 0.5 ),   // 4
            new THREE.Vector2( w * 1.0, h ),         // 5 - br corner control pt
            new THREE.Vector2( w * 0.5, h ),         // 6
            new THREE.Vector2( 0.0, h ),             // 7 - bl corner control pt
            new THREE.Vector2( 0.0, h - 0.5 ),       // 8
            new THREE.Vector2( 0.0, 0.5 )            // 9
        ];
        pillShape.moveTo( pillPts[1].x, pillPts[1].y );
        pillShape.quadraticCurveTo( pillPts[2].x, pillPts[2].y, pillPts[3].x, pillPts[3].y );
        pillShape.lineTo( pillPts[4].x, pillPts[4].y );
        pillShape.quadraticCurveTo( pillPts[5].x, pillPts[5].y, pillPts[6].x, pillPts[6].y );
        pillShape.quadraticCurveTo( pillPts[7].x, pillPts[7].y, pillPts[8].x, pillPts[8].y );
        pillShape.lineTo( pillPts[9].x, pillPts[9].y );
        pillShape.quadraticCurveTo( pillPts[0].x, pillPts[0].y, pillPts[1].x, pillPts[1].y );

        // extrude shape and make geometry
        let extrudeSettings = { amount: 0.1, curveSegments: 64, bevelEnabled: true, bevelSegments: 16, steps: 1, bevelSize: 0.025, bevelThickness: 0.025 };
        let pillGeometry = new THREE.ExtrudeGeometry( pillShape, extrudeSettings );
        pillGeometry.translate( 0.0, h * -0.5, d * 0.5 );
        pillGeometry.scale( scale, scale, scale );
        pillGeometry.rotateX( Math.PI * 0.5 );
        
        // initialize mesh
        super( pillGeometry, material );
        this.castShadow = true;
        this.receiveShadow = true;
        this.name = name;
        this.note = settings.note;
        this.color = settings.color;
        this.hitColor = new THREE.Color( .2, .2, .2 );
        this.hit = false;
        this.prevTime = Date.now();
    }

    getNote() {
        return this.note;
    }

    hitNote() {
        // this.material.emissive.set( this.hitColor );
        this.prevTime = Date.now();
        this.timer = 0.0;
        this.hit = true;
    }

    reset() {
        this.material.emissive.setHSL( 0, 0, 0 );
        this.timer = 0.0;
        this.hit = false;
    }

    update() {
        let now = Date.now();
        let delta = ( now - this.prevTime ) / 1000.0;
        this.prevTime = now;

        if( this.hit ){
            if( this.timer < 1.0 ) {
                this.timer += delta * (1.0 / GLOW_DUR);

                // set alpha of color and set material color
                let brightness = Math.abs( 1.0 - Math.pow( this.timer, 2.0 ) ) * 0.5;
                this.material.emissive.setHSL( 0, 0, brightness );
            } else {
                this.reset();
            }
        } 
    }
}



class Xylophone extends THREE.Object3D {

    constructor(){
        super();
    }

    init(){     
        // add the bars
        const barCount = 8;
        const settings = [
            {
                color: new THREE.Color( 0x1800F0 ),
                note: 'C3'
            },
            {
                color: new THREE.Color( 0x026FE0 ),
                note: 'D3'
            },
            {
                color: new THREE.Color( 0x00DCF5 ),
                note: 'E3'
            },
            {
                color: new THREE.Color( 0x00DB29 ),
                note: 'F3'
            },
            {
                color: new THREE.Color( 0xFFFA00 ),
                note: 'G3'
            },
            {
                color: new THREE.Color( 0xFF8E00 ),
                note: 'A3'
            },
            {
                color: new THREE.Color( 0xFF3D02 ),
                note: 'B3'
            },
            {
                color: new THREE.Color( 0xC41400 ),
                note: 'C4'
            },
        ];

        let scale = 25.0;
        let maxHeight = 0.0;
        let maxWidth = 0.0;
        let minHeight = 2.0 * scale;

        // add bars of the xylophone
        for( let i = 0; i < barCount; i++ ){
            let height = 2.0 + ( ( barCount - i ) * 0.3);
            let bar = new Bar( "bar" + i, scale, height, settings[i] );
            let x = i * 30.0;
            bar.translateX(x);
            this.add( bar );

            // set out max values for use with the base
            maxHeight = Math.max( maxHeight, height * scale );
            maxWidth = Math.max( maxWidth, x + scale );
        }

        // add base
        let baseGroup = new THREE.Group();
        let baseMesh = new Base( maxHeight, minHeight, maxWidth );
        let bounds = baseMesh.getBounds();
        baseGroup.add( baseMesh );

        // add wheels
        let wheelY = -55.0;

        let wheel1Pos = utils.mix( bounds.ul, bounds.ur, 0.2 );
        let wheel1 = new Wheel( new THREE.Vector3( wheel1Pos.x, wheelY, wheel1Pos.y - 12.0 ) );
        baseGroup.add(wheel1);

        let wheel2Pos = utils.mix(bounds.ul, bounds.ur, 0.8);
        let wheel2 = new Wheel( new THREE.Vector3( wheel2Pos.x, wheelY, wheel2Pos.y - 11.0 ) );
        baseGroup.add(wheel2);

        let wheel3Pos = utils.mix(bounds.bl, bounds.br, 0.2);
        let wheel3 = new Wheel( new THREE.Vector3( wheel3Pos.x, wheelY, wheel3Pos.y + 12.0 ) );
        baseGroup.add(wheel3);

        let wheel4Pos = utils.mix(bounds.bl, bounds.br, 0.8);
        let wheel4 = new Wheel( new THREE.Vector3( wheel4Pos.x, wheelY, wheel4Pos.y + 11.0 ) );
        baseGroup.add(wheel4);

        this.add(baseGroup);
        this.name = 'xylophone';
        this.position.set(maxWidth * -0.5, 83.0, 0.0);
    }
}

export{ Bar, Xylophone }