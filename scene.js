/*****
DRAWABLES
*****/



var a=1.0;
var red =    [1.0, 0.0, 0.0, a];
var yellow = [1.0, 1.0, 0.0, a];
var green  = [0.0, 1.0, 0.0, a];
var black  = [0.0, 0.0, 0.0, a];
var violet = [1.0, 0.0, 1.0, a];
var white  = [1.0, 1.0, 1.0, a];
var cyan   = [0.0, 1.0, 1.0, a];
var blue   = [0.0, 0.0, 1.0, a];

class Cube{
	constructor(size){
		this.vertexBuffer = null;
		this.indexBuffer = null;
		this.colorBuffer = null;
		
		//Creation of a movement matrix specific for the object
        //this.mvMatrix = mat4.create();
		
		/*
         0 gl.POINTS
         Draws a single dot per vertex. For example, 10 vertices produce 10 dots.
         1 gl.LINES
         Draws a line between a pair of vertices. For example, 10 vertices produce 5 separate lines.
         2 gl.LINE_STRIP
         Draws a line to the next vertex by a straight line. For example, 10 vertices produce 9 lines connected end to end.
         3 gl.LINE_LOOP
         Similar to gl.LINE_STRIP, but connects the last vertex back to the first. For example, 10 vertices produce 10 straight lines.
         4 gl.TRIANGLES
         Draws a triangle for each group of three consecutive vertices. For example, 12 vertices create 4 separate triangles.
         5 gl.TRIANGLE_STRIP
         Creates a strip of triangles where each additional vertex creates an additional triangle once the first three vertices have been drawn. For example, 12 vertices create 10 triangles.
         6 gl.TRIANGLE_FAN
         Similar to gl.TRIANGLE_STRIP, but creates a fan shaped output. For example 12 vertices create 10 triangles.
		*/
        this.mode = glContext.TRIANGLES;

        // default values
        this.size = 1;
        this.x = this.y = this.z = 0;

	}

    init(){
        this.init1();
        this.init2();
    }

	init1(){
        //Initialisation of the arrays used to construct the object
        this.indices = [];
        this.vertices = [];
        this.colors = [];

        var s = this.size;
        var x = this.x;
        var y = this.y;
        var z = this.z;

        var v0=[x+0, y+0, z+0],
            v1=[x+s, y+0, z+0],
            v2=[x+s, y+0, z+s],
            v3=[x+0, y+0, z+s],
            v4=[x+0, y+s, z+0],
            v5=[x+s, y+s, z+0],
            v6=[x+s, y+s, z+s],
            v7=[x+0, y+s, z+s];

        this.vertices = [].concat(
            v0,v1,v2,v0,v2,v3, //sol
            v0,v4,v7,v0,v7,v3, // gauche
            v0,v1,v5,v0,v5,v4, // fond
            v1,v2,v6,v1,v6,v5, // droite
            v4,v5,v6,v6,v4,v7,  // haut
            v7,v6,v3,v3,v6,v2  // devant
        );
	}

	init2(){
        [red,yellow,green,violet,cyan,blue].forEach(function(color){
            // chaque face a 6 vertices, on applique cette couleur six fois
            for(var i=0;i<6;i++){
                this.colors = this.colors.concat(color);
            }
        },this);

        for(var i=0;i<this.vertices.length/3;i++){
            this.indices.push(i);
        }

        this.vertexBuffer = getVertexBufferWithVertices(this.vertices);
        this.colorBuffer  = getVertexBufferWithVertices(this.colors);
        this.indexBuffer  = getIndexBufferWithIndices(this.indices);
    }
	
	draw(){
        glContext.uniformMatrix4fv(prg.mvMatrixUniform, false, mvMatrix);
		glContext.bindBuffer(glContext.ARRAY_BUFFER, this.vertexBuffer);
		glContext.vertexAttribPointer(prg.vertexPositionAttribute, 3, glContext.FLOAT, false, 0, 0);
		glContext.bindBuffer(glContext.ARRAY_BUFFER, this.colorBuffer);
		glContext.vertexAttribPointer(prg.colorAttribute, 4, glContext.FLOAT, false, 0, 0);
		glContext.bindBuffer(glContext.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
		glContext.drawElements(this.mode, this.indices.length, glContext.UNSIGNED_SHORT,0);
	}
	
}

class Grid extends Cube{
	constructor(size){
		super();
		this.size = size;
		this.init();
	}
	
	init(){
	    super.init1();
	    // supprime les six derniers vertices (la face avant)
        this.vertices.splice(-6*3, 6*3);
        super.init2();
	}
}

class Element extends Cube{
	constructor(x,y,z){
		super();
		this.x=x;
		this.y=y;
		this.z=z;
		this.init();
	}
}

class Bonus extends Element{
    init2(){
        [white, white, white, white, white, white].forEach(function (color) {
            // chaque face a 6 vertices, on applique cette couleur six fois
            for(var i=0;i<6;i++){
                this.colors = this.colors.concat(color);
            }
        },this);

        for(var i=0;i<this.vertices.length/3;i++){
            this.indices.push(i);
        }

        this.vertexBuffer = getVertexBufferWithVertices(this.vertices);
        this.colorBuffer  = getVertexBufferWithVertices(this.colors);
        this.indexBuffer  = getIndexBufferWithIndices(this.indices);
    }
}



/***

SNAKE

***/
var ANIMATION;
var TIMER;

function randint(max){
    return Math.floor(Math.random()*max);
}

class Snake{

    constructor(start=[0,0,0], size=3, dir=[1,0,0]){
        this.size=size;
        this.elements=[];
        var x=start[0],y=start[1],z=start[2];
        for(var i=0;i<size;i++){
            this.elements.push(new Element(x,y,z));
        }

        this.direction=dir;

        this.bonus = new Bonus(randint(SIZE),randint(SIZE),randint(SIZE));
        this.points = 0;
        this.level = 1;
        this.temps = LEVEL_TIME;

        document.getElementById("score").innerHTML = this.points;
        document.getElementById("level").innerHTML = this.level;
        document.getElementById("music").playbackRate = 1;

        this.computeDT();
        this.objectif();

        clearTimeout(ANIMATION);
        clearInterval(TIMER);

        this.animate();
    }

    collision(e){
        var snakeCollision = this.elements.some(function(elem){
            return (elem.x==e.x && elem.y==e.y && elem.z==e.z)
        });
        var wallCollision = !(e.x<SIZE && e.x >= 0 && e.y<SIZE && e.y >= 0 && e.z<SIZE && e.z >= 0);
        return snakeCollision || wallCollision;
    }

    onBonus(e){
        return e.x == this.bonus.x && e.y == this.bonus.y && e.z == this.bonus.z;
    }

    score() {
        this.points += this.level;

        this.objectif();

        document.getElementById("score").innerHTML = this.points;
        document.getElementById("level").innerHTML = this.level;
        playSound("bonusSound");
    }

    move(){
        playSound("moveSound");
        var queue = this.elements.pop();
        var old = queue;
        var tete = this.elements[0];
        queue.x = tete.x + this.direction[0];
        queue.y = tete.y + this.direction[1];
        queue.z = tete.z + this.direction[2];

        // check for collisions
        if (this.collision(queue)) {
            this.gameover();
            return;
        }

        queue.init();

        // ajoute l'élément au début de la liste
        this.elements.unshift(queue);

        if(this.onBonus(queue)){
            var snakeCollision;
            var s = this;
			do{
                s.bonus.x = randint(SIZE);
                s.bonus.y = randint(SIZE);
                s.bonus.z = randint(SIZE);
                snakeCollision = s.elements.some(function(elem){
                    return (elem.x==s.bonus.x && elem.y==s.bonus.y && elem.z==s.bonus.z)
                });
            }while(snakeCollision);
            this.bonus.init();
            // crée un nouvel élément à la fin de la liste
            this.elements.push(new Element(old.x,old.y,old.z));
            this.score();
        }
    }

    gameover() {
        gameover=true;
        clearTimeout(ANIMATION);
        clearInterval(TIMER);
        document.getElementById("music").pause();
        playSound("gameOverSound");
        document.getElementById("gameover-score").innerHTML = this.points;
        gameOverMenu.style.display = "block";
        document.getElementById("nom").focus();
    }

    draw(){
        this.bonus.draw();
        this.elements.forEach(function(elem){
            elem.draw();
        });
    }

    animate(){
        var snake = this;

        function timeout(){
            ANIMATION = setTimeout(function(){
                if(!gameover){
                    snake.move();
                    timeout();
                }
            }, snake.deltaT);
        }
        timeout();

        TIMER = setInterval(function () {
            snake.temps--;
            document.getElementById("temps").innerHTML = snake.temps;
        }, 1000);

        document.getElementById("music").play();
    }
	
	pause(paused){
        if (paused) {
            clearTimeout(ANIMATION);
            clearInterval(TIMER);

            document.getElementById("music").pause();
        }
        else {
            this.animate();
        }
    }

    computeDT() {
        this.deltaT = 100 + (INITIAL_DELTA_T-100)*Math.pow(this.level, -ACCELERATION_FACTOR);
    }

    objectif() {
        var goal = this.level * PALIER;
        var current = this.elements.length - this.size;
        document.getElementById("objectif").innerHTML = "Objectif: " + current + "/" + goal;

        if (current >= goal) {
            // level up !
            playSound("levelUpSound");
            var cadeau = this.temps > 0 ? this.temps * this.level : 0;
            this.points += cadeau;
            this.level++;
            this.computeDT();
            displayMessage("Level "+this.level+"<br>Bonus de niveau:&#8239;" + cadeau);
            this.temps = LEVEL_TIME;
            document.getElementById("music").playbackRate = INITIAL_DELTA_T / this.deltaT;
        }
    }
}


/****

SCENE

*****/







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




/******
UI
*******/

function initCanvas() {
    var canvas = document.getElementById("webgl-canvas");
    var bonus = document.getElementById("bonus");
    var cc = document.getElementById("canvas-container");
    var menu = document.getElementById("game-menu");
    var container = document.getElementById("container");
    var w = window.innerWidth;
    var h = window.innerHeight;

    a = Math.min(w, h) * 0.7;
    canvas.width = canvas.height = a;
    bonus.style.width = cc.style.width = cc.style.height = a + 'px';
    bonus.style.top = (a / 2 - 20) + 'px';
    // menu.style.left = menu.style.top = a / 4 + 'px';
    container.style.maxWidth = a + 'px';

    loadScores();

    handleScroll(cc);

    initWebGL();
}

window.onkeydown = handleKeyPressed;

function handleKeyPressed(ev) {
    // 32 -> spacebar
    if (ev.keyCode == 32) {
        togglePause();
        return;
    }

    var keyToDir = {
        // les clés doivent être des strings, la conversion int->str se fait automatiquement
        "87": "back",                // 87 -> W
        "65": "left", "37": "left",  // 65 -> A, 37 -> left arrow
        "83": "front",               // 83 -> S
        "68": "right", "39": "right",// 68 -> D, 39 -> right arrow
        "38": "up",                  // 38 -> up arrow
        "40": "down"                 // 40 -> down arrow
    };
    changeDirection(keyToDir[ev.keyCode]);
}

function handleScroll(scrollZone) {

    myScroll = new IScroll(scrollZone, {
        tap: true,
        mouseWheel: true,
        preventDefault: false
    });

    myScroll.on('scrollEnd', function () {
        if (gameover) return;
        // Si l'événement provient de la roulette, c'est l'attribut directionX (pourquoi X ? je ne sais pas)
        // qui détermine la direction
        // Sinon si l'événement vient d'un swipe du doigts, on regarde dans l'attribut distY le chemin parcouru en Y
        if (this.directionX == 1 || this.distY > 50) {
            changeDirection("front");
        } else if (this.directionX == -1 || this.distY < -50) {
            changeDirection("back");
        }
    });

    scrollZone.addEventListener('tap', function (e) {
        if (gameover) return;
        var w = parseInt(this.style.width);
        var left = e.pageX - this.getBoundingClientRect().left;
        var top = e.pageY - this.getBoundingClientRect().top;
        var right = w - left;
        var bottom = w - top;
        if (getStandardDeviation([left, top, right, bottom], 1) / w < 0.1) {
            e.stopPropagation();
            togglePause();
            return;
        }
        var choices = [
            {dist: left, direction: "left"},
            {dist: top, direction: "up"},
            {dist: bottom, direction: "down"},
            {dist: right, direction: "right"}
        ];
        var min = choices[0];
        choices.forEach(function (choice) {
            if (choice.dist < min.dist)
                min = choice
        });
        changeDirection(min.direction);
    }, false);
}

function togglePause() {
    if (gameover) return;
    paused = !paused;
    serpent.pause(paused);
    if (paused) var dis = "block";
    else var dis = "none";
    pauseMenu.style.display = dis;
}

function restart() {
    if (paused)
        togglePause();
    initScene();
    document.getElementById("envoyer").disabled = false;
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
        btn_mute.style.color = "red";
    } else {
        btn_mute.style.color = "blue";
    }
    muted = !muted;
}

document.getElementById("music").volume = 0.8;
function toggleMusic(btn_music) {
    var audio = document.getElementById("music");
    if (audio.volume == 0) {
        audio.volume = 0.8;
        btn_music.style.color = "red";
    } else {
        audio.volume = 0;
        btn_music.style.color = "blue";
    }
}

function displayMessage(msg) {
    document.getElementById("bonus").innerHTML = msg;
    setTimeout(function () {
        document.getElementById("bonus").innerHTML = "";
    }, 1500);
}

function playSound(id) {
    if (muted)return;
    var audio = document.getElementById(id);
    audio.pause();
    audio.currentTime = 0;
    audio.play();
}

function loadScores() {
    makeCorsRequest("GET", "http://j4kim.nexgate.ch/snake3d/getScores.php").then(function (result) {
        document.getElementById("scores").innerHTML = result;
    });
}

document.getElementById("envoyer").addEventListener('click', function (e) {
    e.preventDefault();
    postScore();
});

function postScore() {
    var score = document.getElementById("gameover-score").innerHTML;
    var name = document.getElementById("nom").value;
    makeCorsRequest(
        "POST", "http://j4kim.nexgate.ch/snake3d/postScore.php",
        "score=" + score + "&name=" + name)
        .then(function (result) {
                document.getElementById("envoyer").disabled = true;
                loadScores();
        }
        );
}
