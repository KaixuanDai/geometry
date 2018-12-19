var createScene = function() {
    var scene = new BABYLON.Scene(engine);

    var camera = new BABYLON.ArcRotateCamera("Camera", - Math.PI / 2, Math.PI / 4, 250, new BABYLON.Vector3(0, -25, 0), scene);
    camera.attachControl(canvas, true);
	
	var light = new BABYLON.DirectionalLight("DirectionalLight", new BABYLON.Vector3(0, -1, 1), scene);
    var light2 = new BABYLON.HemisphericLight("HemiLight", new BABYLON.Vector3(0, 1, 0), scene);   
    light2.intensity =0.5;

    BABYLON.Effect.ShadersStore["customVertexShader"]= "\r\n"+   
		"precision highp float;\r\n"+

    	"// Attributes\r\n"+
    	"attribute vec3 position;\r\n"+
        "attribute vec3 normal;\r\n"+

    	"// Uniforms\r\n"+
    	"uniform mat4 worldViewProjection;\r\n"+
        "uniform float time;\r\n"+

    	"void main(void) {\r\n"+
        "    vec3 p = position;\r\n"+
        "    vec3 j = vec3(0., -1.0, 0.);\r\n"+
        "    p = p + normal * log2(1. + time) * 25.0;\r\n"+
    	"    gl_Position = worldViewProjection * vec4(p, 1.0);\r\n"+
    	"}\r\n";

    BABYLON.Effect.ShadersStore["customFragmentShader"]="\r\n"+
	   "precision highp float;\r\n"+

    	"uniform float time;\r\n"+

    	"void main(void) {\r\n"+
    	"    gl_FragColor = vec4(1. - log2(1. + time)/100., 1. * log2(1. + time), 0., 1. - log2(1. + time/2.)/log2(1. + 3.95));\r\n"+
    	"}\r\n";



    var shaderMaterial = new BABYLON.ShaderMaterial("shader", scene, {
        vertex: "custom",
        fragment: "custom",
	    },
        {
			attributes: ["position", "normal", "uv"],
			uniforms: ["world", "worldView", "worldViewProjection", "view", "projection"],
            needAlphaBlending: true
        });


    shaderMaterial.backFaceCulling = false;

    var sphere = BABYLON.MeshBuilder.CreateSphere("sphere", {diameter:10}, scene);
    sphere.convertToFlatShadedMesh();	

    sphere.material = shaderMaterial;

    var t = 0.;
    var time = 0.;
    scene.registerBeforeRender(function() {
        if(time<8) {
            sphere.material.setFloat("time", time);
            time +=0.1;
        }   
        else {
            sphere.dispose();
        }
    });

	return scene;
}