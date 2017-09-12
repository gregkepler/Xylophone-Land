import * as THREE from 'three'
import AbstractApplication from './views/AbstractApplication'
import shaderVert from './shaders/custom.vert'
import shaderFrag from './shaders/custom.frag'
import Xylophone from './views/Xylophone'

class Main extends AbstractApplication {
    constructor(){

        super();

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

        // this._mesh = new THREE.Mesh( geometry, material2 );
        // this._scene.add( this._mesh );
        this._scene.add( this.xylophone )

        this._scene.add( new THREE.AmbientLight( 0x222222 ) );
        var directionalLight = new THREE.DirectionalLight( 0xffffff, 1 );
        directionalLight.position.set( 1, 1, 1 ).normalize();
        this._scene.add( directionalLight );

        this.animate();

    }

}

export default Main;