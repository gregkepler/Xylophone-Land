import 'three'
import shaderVert from '../shaders/custom.vert'
import shaderFrag from '../shaders/custom.frag'

export default class Ground extends THREE.Object3D {

	constructor(position) {
		super();

		this.startTime = Date.now();
		this.prevTime = Date.now();
		this.color = new THREE.Vector3(1.0, 1.0, 0.0);
		this.timer = 0.0;
		this.hit = false;
		this.uniforms = {
			iTime: { type: "f", value: 1.0 },
			iResolution: { type: "v2", value: new THREE.Vector2(100, 100) },
			iColor: {type: "v3", value: this.color},
			iBlast: {type: "f", value: this.timer}
		}

		 // ground
        var groundGeom = new THREE.PlaneBufferGeometry( 100, 100 );
        var groundMaterial = new THREE.MeshPhongMaterial( { 
        	color: 0xffffff,
        	transparent: true,
        	opacity: 0.5,
        	blending: THREE.MultiplyBlending
        } );
        
        var material = new THREE.ShaderMaterial( {
			// uniforms: params[ i ][ 1 ],
			lights: true,
			vertexShader: shaderVert,
			fragmentShader: shaderFrag
		} );

        {
        		var shadowMesh = new THREE.Mesh(groundGeom, groundMaterial);
                shadowMesh.name = "ground";
                shadowMesh.rotation.x = - Math.PI / 2;
                shadowMesh.scale.set( 100, 100, 100 );
                shadowMesh.castShadow = false;
                shadowMesh.receiveShadow = true;
                this.add( shadowMesh );
        }

        // ground        
        var material = new THREE.ShaderMaterial( {
			vertexShader: shaderVert,
			fragmentShader: shaderFrag,
			uniforms: this.uniforms
		} );
		{
				var shadowMesh = new THREE.Mesh(groundGeom, material);
		        shadowMesh.name = "ground";
		        shadowMesh.rotation.x = - Math.PI / 2;
		        shadowMesh.position.y = -0.1;
		        shadowMesh.scale.set( 100, 100, 100 );
		        shadowMesh.castShadow = false;
		        shadowMesh.receiveShadow = false;
		        this.add( shadowMesh );
		}
        
		this.name = 'ground-group';
	}

	hitNote(color) {
		this.color = new THREE.Vector3(color.r, color.g, color.b);
		// console.log(this.uniforms.iColor);
		this.hit = true;
		this.timer = 0.0;
	}

	update() {
		var now = Date.now();
		var elapsedMilliseconds = now - this.startTime;
		var elapsedSeconds = elapsedMilliseconds / 1000.0;
		var elapsed = (now - this.prevTime) / 1000.0;
		this.prevTime = now;
		this.uniforms.iTime.value = elapsedSeconds;
		this.uniforms.iColor.value = this.color;
		this.uniforms.iBlast.value = this.timer;

		if(this.hit && this.timer < 1.0){
			this.timer += elapsed;
			// console.log(this.timer);
		} if( this.hit && this.timer >= 1.0 ) {
			this.hit = false;
			this.timer = 0.0;
		}
	}
}

