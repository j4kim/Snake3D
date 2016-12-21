
var mvMatrix = mat4.create();
var pMatrix = mat4.create();

var SIZE = 7;
var sceneObjects = [];

var serpent;
var paused = false;
var pauseMenu = document.getElementById("pause-menu");
var gameOverMenu = document.getElementById("gameover-menu");

initWebGL();

window.onkeydown = handleKeyPressed;

function handleKeyPressed(ev){
	// test pas joli au cas où on est en game over
	if (gameOverMenu.style.display == "block") return;
    var direction = [1,0,0];
    switch(ev.keyCode){
        case 87: //w
            direction = [0,0,-1]; break;
        case 65: //a
        case 37: //left
            direction = [-1,0,0]; break;
        case 83: //s
            direction = [0,0,1]; break;
        case 68: //d
        case 39: //right
            direction = [1,0,0]; break;
        case 38: //up
            direction = [0,1,0]; break;
        case 40: //down
            direction = [0,-1,0]; break;
        case 32: //spacebar
            togglePause(); break;
        default: break;
    }
    serpent.direction = direction;
    //console.log(ev.keyCode);
}

function togglePause(){
	paused = !paused;
	serpent.pause(paused);
	if(paused) var dis = "block";
	else var dis = "none";
	pauseMenu.style.display = dis;
}

function initShaderParameters(prg){
	prg.vertexPositionAttribute = glContext.getAttribLocation(prg, "aVertexPosition");
	glContext.enableVertexAttribArray(prg.vertexPositionAttribute);
	prg.colorAttribute 			= glContext.getAttribLocation(prg, "aColor");
	glContext.enableVertexAttribArray(prg.colorAttribute);
	prg.pMatrixUniform          = glContext.getUniformLocation(prg, 'uPMatrix');
	prg.mvMatrixUniform         = glContext.getUniformLocation(prg, 'uMVMatrix');

    prg.uSize = glContext.getUniformLocation(prg, "uSize");

    glContext.uniform1f(prg.uSize,SIZE);
}

function initScene(){

	mat4.identity(pMatrix);
	mat4.perspective(pMatrix, degToRad(90), c_width / c_height, 0.1, 100.0);
	mat4.identity(mvMatrix);

	mat4.translate(pMatrix,pMatrix,vec3.fromValues(-SIZE/2, -SIZE/2, -1.671*SIZE));

    glContext.enable(glContext.DEPTH_TEST);
	
	sceneObjects.push(new Grid(SIZE));

    serpent = new Snake([-1,0,0],2);
	sceneObjects.push(serpent);

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
