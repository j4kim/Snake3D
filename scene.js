
var mvMatrix = mat4.create();
var pMatrix = mat4.create();

var SIZE = 6;
var sceneObjects = [];

initWebGL();


function initShaderParameters(prg){
	prg.vertexPositionAttribute = glContext.getAttribLocation(prg, "aVertexPosition");
	glContext.enableVertexAttribArray(prg.vertexPositionAttribute);
	prg.colorAttribute 			= glContext.getAttribLocation(prg, "aColor");
	glContext.enableVertexAttribArray(prg.colorAttribute);
	prg.pMatrixUniform          = glContext.getUniformLocation(prg, 'uPMatrix');
	prg.mvMatrixUniform         = glContext.getUniformLocation(prg, 'uMVMatrix');
}

function initScene(){

	mat4.identity(pMatrix);
	mat4.perspective(pMatrix, degToRad(90), c_width / c_height, 0.1, 100.0);
	mat4.identity(mvMatrix);

	mat4.translate(pMatrix,pMatrix,vec3.fromValues(-SIZE/2, -SIZE/2, -1.671*SIZE));
	
	sceneObjects.push(new Grid(SIZE));
	
	glContext.enable(glContext.DEPTH_TEST);
	
	sceneObjects.push(new Cube(0,0,0));
	sceneObjects.push(new Cube(1,0,0));
	sceneObjects.push(new Cube(2,0,0));
	sceneObjects.push(new Cube(3,0,0));
	sceneObjects.push(new Cube(3,1,0));
	sceneObjects.push(new Cube(4,1,0));
	sceneObjects.push(new Cube(5,1,0));
	sceneObjects.push(new Cube(5,2,0));
	sceneObjects.push(new Cube(5,3,0));
	sceneObjects.push(new Cube(5,4,0));
	sceneObjects.push(new Cube(5,4,1));
	sceneObjects.push(new Cube(5,4,2));
	sceneObjects.push(new Cube(5,4,3));
	sceneObjects.push(new Cube(4,4,3));
	sceneObjects.push(new Cube(3,4,3));
	sceneObjects.push(new Cube(2,4,3));
	sceneObjects.push(new Cube(2,4,4));
	sceneObjects.push(new Cube(2,3,4));
	sceneObjects.push(new Cube(1,3,4));
	sceneObjects.push(new Cube(1,2,4));
	sceneObjects.push(new Cube(0,2,4));
	sceneObjects.push(new Cube(0,2,5));
	sceneObjects.push(new Cube(0,1,5));
	sceneObjects.push(new Cube(0,0,5));
	sceneObjects.push(new Cube(1,0,5));
	sceneObjects.push(new Cube(2,0,5));
	sceneObjects.push(new Cube(3,0,5));
	sceneObjects.push(new Cube(4,0,5));
	sceneObjects.push(new Cube(5,0,5));
	sceneObjects.push(new Cube(5,0,4));
	sceneObjects.push(new Cube(5,0,3));

	glContext.clearColor(0.2, 0.2, 0.2, 1.0);
  
}

function drawScene(){
	glContext.clear(glContext.COLOR_BUFFER_BIT | glContext.DEPTH_BUFFER_BIT);

	glContext.uniformMatrix4fv(prg.pMatrixUniform, false, pMatrix);
	
	sceneObjects.forEach(function(o){
		o.draw();
	});
}

function initWebGL(){
	glContext = getGLContext('webgl-canvas');
	initProgram();
	initScene();
	renderLoop();
}
