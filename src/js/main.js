"use strict";

import 'three';
import 'three/examples/js/controls/OrbitControls';
import 'three/examples/js/utils/ShadowMapViewer.js';
import 'tone';

import { Xylophone, Bar } from './views/Xylophone';
import Ground from './views/Ground';

var SHADOW_MAP_WIDTH = 1024;
var SHADOW_MAP_HEIGHT = 1024;

class Main {
    
    constructor() {
        this.initScene();
        this.initLights();
        this.initViews();
        this.initSynth();
        this.addEventListeners();

        // for interactivity
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();
        this.intersected = undefined;
        this.timer = 0.0;
        this.prevTime = Date.now();

        this.animate();
    }

    initScene(){
        // set up camera
        this.camera = new THREE.PerspectiveCamera( 30, window.innerWidth / window.innerHeight, 1, 10000 );
        this.camera.position.x = 300;
        this.camera.position.y = 400;
        this.camera.position.z = 400;

        this.scene = new THREE.Scene();

        this.renderer = new THREE.WebGLRenderer( { antialias: true }  );
        this.renderer.setPixelRatio( window.devicePixelRatio );
        this.renderer.setSize( window.innerWidth, window.innerHeight );
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFShadowMap;

        document.body.appendChild( this.renderer.domElement );

        this.controls = new THREE.OrbitControls( this.camera, this.renderer.domElement );
    }

    initLights() {
        // lights
        let ambient = new THREE.AmbientLight( 0x444444 );
        this.scene.add( ambient );

        let light = new THREE.SpotLight( 0xffffff, 0.5 );
        light.position.set( 0, 400, 150 );
        light.target.position.set( 0, 0, 0 );
        light.castShadow = true;
        light.shadow = new THREE.LightShadow( new THREE.PerspectiveCamera( 30, 1, 100, 1500 ) );
        light.shadow.bias = 0.0001;
        light.shadow.mapSize.width = SHADOW_MAP_WIDTH;
        light.shadow.mapSize.height = SHADOW_MAP_HEIGHT;
        this.scene.add( light );
    }

    initViews() {
        // make the xylophone
        this.xylophone = new Xylophone();
        this.xylophone.init();
        this.scene.add( this.xylophone );
   
        // ground
        this.ground = new Ground();
        this.scene.add( this.ground );
    }

    initSynth() {
        // audio setup
        // settings based on ToneJS monosynth example settings
        // https://github.com/Tonejs/Tone.js/blob/master/examples/monoSynth.html
        this.synth = new Tone.MonoSynth({
            "portamento" : 0.02,
            "oscillator" : {
                "type" : "square"
            },
            "envelope" : {
                "attack" : 0.005,
                "decay" : 0.2,
                "sustain" : 0.4,
                "release" : 1.4,
            },
            "filterEnvelope" : {
                "attack" : 0.005,
                "decay" : 0.1,
                "sustain" : 0.05,
                "release" : 0.8,
                "baseFrequency" : 300,
                "octaves" : 4
            }
        }).toMaster();
    }

    addEventListeners() {
        document.addEventListener( 'mousedown', this.onDocumentMouseDown.bind(this), false );
        document.addEventListener( 'mousemove', this.onDocumentMouseMove.bind(this), false );
        window.addEventListener( 'resize', this.onWindowResize.bind(this), false );
    }

    onDocumentMouseDown( event ) {
        event.preventDefault();
        
        // find intersections within xylophone children
        let intersects = this.raycaster.intersectObjects( this.xylophone.children );
        
        if ( intersects.length > 0 ) 
        {
            // reset the previously set bar
            if ( this.intersected ) {
                this.intersected.reset();
                this.intersected = null;
            }

            // select new bar
            let isBar = intersects[ 0 ].object.constructor.name === "Bar";
            if( isBar ){
                this.intersected = intersects[ 0 ].object;

                 // select bar
                this.intersected.hitNote();

                // dispatch audio
                let note = this.intersected.getNote();
                this.synth.triggerAttackRelease( note, '8n' );

                // dispatch note hit to ground
                this.ground.hitNote( this.intersected.material.color );
            }
           
        } else {
            if ( this.intersected ) this.intersected.reset();
            this.intersected = null;
        }       
    }

    onDocumentMouseMove( event ) {
        event.preventDefault();
        this.mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
        this.mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
    }

    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();

        this.renderer.setSize( window.innerWidth, window.innerHeight );
    }

    animate( timestamp ) {
        requestAnimationFrame( this.animate.bind(this) );

        this.raycaster.setFromCamera( this.mouse, this.camera );

        this.controls.update();
        this.ground.update();
        if( this.intersected ){
            this.intersected.update();    
        }
        this.renderer.render( this.scene, this.camera );
    }
}

export default Main;