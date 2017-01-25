
var mvMatrix = mat4.create();
var pMatrix = mat4.create();

var SIZE = 7;
var sceneObjects = [];

var serpent;
var paused = false, muted = false;
var pauseMenu = document.getElementById("pause-menu");
var gameOverMenu = document.getElementById("gameover-menu");

initCanvas();
initWebGL();

window.onkeydown = handleKeyPressed;

function handleKeyPressed(ev){
	// test pas joli au cas où on est en game over
    if (gameOverMenu.style.display == "block" && ev.keyCode == 32) {
        gameOverMenu.style.display = "none";
        initScene();
        console.log("reinit");
        return;
    }
    switch(ev.keyCode){
        case 87: //w
            serpent.direction = [0, 0, -1];
            break;
        case 65: //a
        case 37: //left
            serpent.direction = [-1, 0, 0];
            break;
        case 83: //s
            serpent.direction = [0, 0, 1];
            break;
        case 68: //d
        case 39: //right
            serpent.direction = [1, 0, 0];
            break;
        case 38: //up
            serpent.direction = [0, 1, 0];
            break;
        case 40: //down
            serpent.direction = [0, -1, 0];
            break;
        case 32: //spacebar
            togglePause(); break;
        default: break;
    }
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

    glContext.uniform1f(prg.uSize, SIZE);
}

function initScene(){
    sceneObjects = [];

	mat4.identity(pMatrix);
	mat4.perspective(pMatrix, degToRad(90), c_width / c_height, 0.1, 100.0);
	mat4.identity(mvMatrix);

    // -1.671 est la valeur qui permet d'avoir toujours le même affichage avec une grille plus grande
    mat4.translate(mvMatrix, mvMatrix, vec3.fromValues(-SIZE / 2, -SIZE / 2, -1.51 * SIZE));

    glContext.enable(glContext.DEPTH_TEST);
	
	sceneObjects.push(new Grid(SIZE));

    serpent = new Snake([-1,0,0],2);
	sceneObjects.push(serpent);

    glContext.clearColor(0.0, 0.0, 0.0, 0.0);
  
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

function initCanvas() {
    var w = window.innerWidth;
    var h = window.innerHeight;
    a = Math.min(w, h) * 0.75;
    var canvas = document.getElementById("webgl-canvas");
    var bonus = document.getElementById("bonus");
    canvas.width = canvas.height = a;
    var cc = document.getElementById("canvas-container");
    bonus.style.width = cc.style.width = cc.style.height = a + 'px';
    bonus.style.top = (a / 2 - 20) + 'px';
    var menu = document.getElementById("game-menu");
    menu.style.left = menu.style.top = a / 4 + 'px';
    var container = document.getElementById("container");
    container.style.maxWidth = (100 + a) + 'px';
}

function toggleHelp() {
    help = document.getElementById("help");
    if (help.style.display == "block") {
        help.style.display = "none";
    } else {
        help.style.display = "block";
        if (!paused)
            togglePause();
    }
}

function toggleMute(btn_mute) {
    if (muted) {
        btn_mute.innerHTML = "désactiver son";
    } else {
        btn_mute.innerHTML = "activer son";
    }
    muted = !muted;
}