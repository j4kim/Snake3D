var ANIMATION;
var PALIER = 5;
var TIMER;
var LEVEL_TIME = 30;

function randint(max){
    return Math.floor(Math.random()*max);
}

function playSound(id) {
    if (muted)return;
    document.getElementById(id).pause();
    document.getElementById(id).currentTime = 0;
    document.getElementById(id).play();
}

function displayMessage(msg) {
    document.getElementById("bonus").innerHTML = msg;
    setTimeout(function () {
        document.getElementById("bonus").innerHTML = "";
    }, 1500);
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

        document.getElementById("score").innerHTML = this.points;
        document.getElementById("level").innerHTML = this.level;

        this.computeDT();

        this.temps = LEVEL_TIME;

        this.objectif();

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
        clearInterval(ANIMATION);
        clearInterval(TIMER);
        playSound("gameOverSound");
        document.getElementById("gameover-score").innerHTML = this.points;
        gameOverMenu.style.display = "block";
    }

    draw(){
        this.bonus.draw();
        this.elements.forEach(function(elem){
            elem.draw();
        });
    }

    animate(){
        var snake = this;

        ANIMATION = setInterval(function(){
            snake.move();
        }, snake.deltaT);

        TIMER = setInterval(function () {
            snake.temps--;
            document.getElementById("temps").innerHTML = snake.temps;
        }, 1000);
    }
	
	pause(paused){
        if (paused) {
            console.log(ANIMATION)
            clearInterval(ANIMATION);
            clearInterval(TIMER);
        }
        else {
            this.animate();
        }
    }

    computeDT() {
        this.deltaT = 500 * Math.pow(this.level, -0.5);
    }

    objectif() {
        var goal = this.level * PALIER;
        var current = this.elements.length - this.size;
        document.getElementById("objectif").innerHTML = "Objectif: " + current + "/" + goal;

        if (current >= goal) {
            // level up !
            var cadeau = this.temps > 0 ? this.temps * this.level : 0;
            this.points += cadeau;
            displayMessage("Bonus de niveau: " + cadeau);
            this.level++;
            this.temps = LEVEL_TIME;
        }
    }
}
