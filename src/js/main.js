import 'three'
import 'three/examples/js/controls/OrbitControls'
import 'three/examples/js/utils/ShadowMapViewer.js'

import shaderVert from './shaders/custom.vert'
import shaderFrag from './shaders/custom.frag'
import Xylophone from './views/Xylophone'

var SHADOW_MAP_WIDTH = 4096;
var SHADOW_MAP_HEIGHT = 2048;

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

        //this._controls.addEventListener( 'change', render ); // add this only if there is no animation loop (requestAnimationFrame)
        // this._controls.enableDamping = true;
        // this._controls.dampingFactor = 0.25;
        // this._controls.enableZoom = false;

        window.addEventListener( 'resize', this.onWindowResize.bind(this), false );


        // lights
        var ambient = new THREE.AmbientLight( 0x444444 );
        this._scene.add( ambient );


        var light = new THREE.SpotLight( 0xffffff, 0.25 );
        light.position.set( 0, 1500, 1000 );
        light.target.position.set( 0, 0, 0 );
        light.castShadow = true;
        light.shadow = new THREE.LightShadow( new THREE.PerspectiveCamera( 50, 1, 1200, 2500 ) );
        light.shadow.bias = 0.001;
        light.shadow.mapSize.width = SHADOW_MAP_WIDTH;
        light.shadow.mapSize.height = SHADOW_MAP_HEIGHT;

        this._scene.add( light );


        var texture = new THREE.TextureLoader().load( 'assets/textures/crate.gif' );

        var geometry = new THREE.BoxGeometry( 200, 200, 200 );
        var material = new THREE.MeshBasicMaterial( { map: texture } );

        var material2 = new THREE.ShaderMaterial({
            vertexShader: shaderVert,
            fragmentShader: shaderFrag
        });


        // make the xylophone
        this.xylophone = new Xylophone();
        this.xylophone.init();

     
        // ground
        var groundGeom = new THREE.PlaneBufferGeometry( 100, 100 );
        var groundMaterial = new THREE.MeshPhongMaterial( { color: 0xffdd99 } );
        var ground = new THREE.Mesh( groundGeom, groundMaterial );
        ground.rotation.x = - Math.PI / 2;
        ground.scale.set( 100, 100, 100 );
        ground.castShadow = false;
        ground.receiveShadow = true;
        this._scene.add( ground );




        // this._mesh = new THREE.Mesh( geometry, material2 );
        // this._scene.add( this._mesh );
        this._scene.add( this.xylophone )

        this._scene.add( new THREE.AmbientLight( 0x222222 ) );
        var directionalLight = new THREE.DirectionalLight( 0xffffff, 1 );
        directionalLight.position.set( 1, 1, 1 ).normalize();
        this._scene.add( directionalLight );

        this.animate();

    }

    onWindowResize() {

        this._camera.aspect = window.innerWidth / window.innerHeight;
        this._camera.updateProjectionMatrix();

        this._renderer.setSize( window.innerWidth, window.innerHeight );

    }

    animate(timestamp) {
        requestAnimationFrame( this.animate.bind(this) );

        //this._controls.update();
        this._renderer.render( this._scene, this._camera );

    }

}

export default Main;