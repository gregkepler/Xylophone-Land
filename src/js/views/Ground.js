"use strict";

import 'three';
import shaderVert from '../shaders/custom.vert';
import shaderFrag from '../shaders/custom.frag';

const BLAST_DUR = 2.0;    // duration of the blast

export default class Ground extends THREE.Object3D {

    constructor() {
        super();

        this.startTime = Date.now();
        this.prevTime = Date.now();
        this.color = new THREE.Vector3( 1.0, 1.0, 0.0 );
        this.timer = 0.0;
        this.hit = false;
        this.uniforms = {
            iTime: { type: "f", value: 1.0 },
            iResolution: { type: "v2", value: new THREE.Vector2( 100, 100 ) },
            iColor: { type: "v3", value: this.color },
            iBlast: { type: "f", value: this.timer }
        };

        let groundGeom = new THREE.PlaneBufferGeometry( 100, 100 );
        this.add( this.createShadowPlane( groundGeom ) );
        this.add( this.createShaderPlane( groundGeom ) );
        this.name = 'ground-group';
    }

    // Create the mesh that receives the shadows of other objects
    createShadowPlane( groundGeom ){
        
        // This material is semi-transparent and as multiplied blending,
        // which will allow the shader mesh to be visible beneath it
        let material = new THREE.MeshPhongMaterial( { 
            color: 0xffffff,
            transparent: true,
            opacity: 0.5,
            blending: THREE.MultiplyBlending
        });

        let groundMesh = new THREE.Mesh(groundGeom, material);
        groundMesh.name = "ground";
        groundMesh.rotation.x = - Math.PI / 2;
        groundMesh.scale.set( 100, 100, 100 );
        groundMesh.castShadow = false;
        groundMesh.receiveShadow = true;
        return groundMesh;
    }

    // Create the mesh that reacts to events and renders a shader material
    createShaderPlane( groundGeom ){
         
        let material = new THREE.ShaderMaterial( {
            vertexShader: shaderVert,
            fragmentShader: shaderFrag,
            uniforms: this.uniforms
        } );
        
        let groundMesh = new THREE.Mesh( groundGeom, material );
        groundMesh.name = "ground";
        groundMesh.rotation.x = - Math.PI / 2;
        groundMesh.position.y = -0.1;           // offset the plane below the shadow plan
        groundMesh.scale.set( 100, 100, 100 );
        groundMesh.castShadow = false;
        groundMesh.receiveShadow = false;
        return groundMesh;
    }

    hitNote(color) {

        this.color = new THREE.Vector3( color.r, color.g, color.b );
        this.hit = true;
        this.timer = 0.0;
    }

    update() {

        let now = Date.now();
        let elapsedMilliseconds = now - this.startTime;
        let elapsedSeconds = elapsedMilliseconds / 1000.0;
        let delta = ( now - this.prevTime ) / 1000.0;
        this.prevTime = now;

        // determine timer values for the shader
        if(this.hit && this.timer < 1.0){
            // the timer value is always between 0.0 and 1.0
            this.timer += delta * (1.0 / BLAST_DUR);
        } 
        else if( this.hit && this.timer >= 1.0 ) {
            this.hit = false;
            this.timer = 0.0;
        }

        // update shader uniforms
        this.uniforms.iTime.value = elapsedSeconds;
        this.uniforms.iColor.value = this.color;
        this.uniforms.iBlast.value = this.timer;
    }
}

