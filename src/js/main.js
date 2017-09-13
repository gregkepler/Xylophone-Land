import 'three'
import 'three/examples/js/controls/OrbitControls'
import 'three/examples/js/utils/ShadowMapViewer.js'
import 'tone'

import Xylophone from './views/Xylophone'
import Ground from './views/Ground'

var SHADOW_MAP_WIDTH = 1024;
var SHADOW_MAP_HEIGHT = 1024;
var INTERSECTED;

class Main {
    


    constructor(){

        // setup camera
        this._camera = new THREE.PerspectiveCamera( 30, window.innerWidth / window.innerHeight, 1, 10000 );
        this._camera.position.y = 300;
        this._camera.position.z = 500;

        this._scene = new THREE.Scene();

        this._renderer = new THREE.WebGLRenderer( { antialias: true }  );
        this._renderer.setPixelRatio( window.devicePixelRatio );
        this._renderer.setSize( window.innerWidth, window.innerHeight );
        this._renderer.shadowMap.enabled = true;
        this._renderer.shadowMap.type = THREE.PCFShadowMap;

        document.body.appendChild( this._renderer.domElement );

        this._controls = new THREE.OrbitControls( this._camera, this._renderer.domElement );

        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();

        window.addEventListener( 'resize', this.onWindowResize.bind(this), false );


        // lights
        var ambient = new THREE.AmbientLight( 0x444444 );
        this._scene.add( ambient );


        var light = new THREE.SpotLight( 0xffffff, 0.5 );
        light.position.set( 0, 400, 150 );
        light.target.position.set( 0, 0, 0 );
        light.castShadow = true;
        light.shadow = new THREE.LightShadow( new THREE.PerspectiveCamera( 30, 1, 100, 1500 ) );
        light.shadow.bias = 0.0001;
        light.shadow.mapSize.width = SHADOW_MAP_WIDTH;
        light.shadow.mapSize.height = SHADOW_MAP_HEIGHT;

        this._scene.add( light );


        // make the xylophone
        this.xylophone = new Xylophone();
        this.xylophone.init();
        this._scene.add( this.xylophone )
   
        // ground
        this.ground = new Ground();
        this._scene.add( this.ground );


        // audio
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


        this.animate();
        document.addEventListener( 'mousedown', this.onDocumentMouseDown.bind(this), false );
        document.addEventListener( 'mousemove', this.onDocumentMouseMove.bind(this), false );
    }

    onDocumentMouseDown( event ) 
    {
        event.preventDefault();
        
        
        // find intersections
        
        var prevIntersection = INTERSECTED;
        var intersects = this.raycaster.intersectObjects( this.xylophone.children );
        if ( intersects.length > 0 ) {
            // select the intersected one
            // if ( INTERSECTED != intersects[ 0 ].object ) {
                if ( INTERSECTED ) INTERSECTED.material.emissive.setHex( INTERSECTED.currentHex );

                INTERSECTED = intersects[ 0 ].object;
                INTERSECTED.currentHex = INTERSECTED.material.emissive.getHex();
                INTERSECTED.material.emissive.setHex( 0x505050 );

                // dispatch audio
                var note = INTERSECTED.getNote();
                this.synth.triggerAttackRelease( note, '8n');
                this.ground.hitNote( INTERSECTED.material.color );
            // }
        } else {
            if ( INTERSECTED ) INTERSECTED.material.emissive.setHex( INTERSECTED.currentHex );
            INTERSECTED = null;
        }

       
    }

    onDocumentMouseMove( event ) {
        event.preventDefault();
        this.mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
        this.mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
    }

    onWindowResize() {

        this._camera.aspect = window.innerWidth / window.innerHeight;
        this._camera.updateProjectionMatrix();

        this._renderer.setSize( window.innerWidth, window.innerHeight );

    }

    animate(timestamp) {
        requestAnimationFrame( this.animate.bind(this) );

        this.raycaster.setFromCamera( this.mouse, this._camera );

        this._controls.update();
        this.ground.update();
        this._renderer.render( this._scene, this._camera );

    }

}

export default Main;