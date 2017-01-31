/* INITIALISATION */

var mvMatrix = mat4.create();
var pMatrix = mat4.create();

/* Configuration du jeu éditable */
var SIZE = 7;                  // [3 à n] taille de la grille 3D
var FOV = 90;                  // angle de vue en degrés
var SHADOW_FACTOR = 0.6;       // [0 à 1] présence de l'effet d'ombrage
var PALIER = 5;                // [1 à n] nombre de bonus à prendre pour passer le niveau
var LEVEL_TIME = 30;           // temps maximum pour obtenir un bonus de niveau (en secondes)
var INITIAL_DELTA_T = 500;     // [100 à 1000] delta t entre les mouvements du serpent (en millisecondes)
var ACCELERATION_FACTOR = 0.2; // [0 à 1] accélération du serpent entre deux niveaux
var SNAKE_SIZE = 2;            // [2 à n] taille initiale du serpent

var sceneObjects = [];
var serpent;
var paused = false, gameover = false, muted = false;
var pauseMenu = document.getElementById("pause-menu");
var gameOverMenu = document.getElementById("gameover-menu");


function changeDirection(dir) {
    switch (dir) {
        case "back":
            serpent.direction = [0, 0, -1];
            break;
        case "left":
            serpent.direction = [-1, 0, 0];
            break;
        case "front": //s -> front
            serpent.direction = [0, 0, 1];
            break;
        case "right": //right
            serpent.direction = [1, 0, 0];
            break;
        case "up": //up
            serpent.direction = [0, 1, 0];
            break;
        case "down": //down
            serpent.direction = [0, -1, 0];
            break;
        default: break;
    }
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
    prg.uShadow = glContext.getUniformLocation(prg, "uShadow");

    glContext.uniform1f(prg.uSize, SIZE);
    glContext.uniform1f(prg.uShadow, SHADOW_FACTOR);
}

function initScene(){
    gameOverMenu.style.display = "none";
    gameover = false;
    sceneObjects = [];

	mat4.identity(mvMatrix);

    var alpha = FOV/2 * Math.PI/180;
    var z = SIZE + SIZE/(2*Math.tan(alpha));

    mat4.translate(mvMatrix, mvMatrix, vec3.fromValues(-SIZE / 2, -SIZE / 2, -z));

    mat4.identity(pMatrix);
    mat4.perspective(pMatrix, degToRad(FOV), c_width / c_height, 0.1, z+1);

    glContext.enable(glContext.DEPTH_TEST);
	
	sceneObjects.push(new Grid(SIZE));

    serpent = new Snake([-1,0,0],SNAKE_SIZE);
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