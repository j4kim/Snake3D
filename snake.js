var ANIMATION;

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
        this.animate();

        this.bonus = new Bonus(randint(SIZE),randint(SIZE),randint(SIZE));
        this.points = 0;

        this.casesLibres=[];
        for(var i=0;i<SIZE;i++)
            for(var j=0;j<SIZE;j++)
                for(var k=0; k<SIZE; k++)
                    this.casesLibres.push(i+''+j+''+k);

        console.log(this.casesLibres);
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
        this.points++;
        document.getElementById("score").innerHTML = this.points;
        document.getElementById("bonusSound").pause();
        document.getElementById("bonusSound").currentTime = 0;
        document.getElementById("bonusSound").play();
    }

    move(){
        var queue = this.elements.pop();
        var old = queue;
        var tete = this.elements[0];
        queue.x = tete.x + this.direction[0];
        queue.y = tete.y + this.direction[1];
        queue.z = tete.z + this.direction[2];

        // check for collisions
        if(this.collision(queue)){
            console.log("collision");
            clearInterval(ANIMATION);
            document.getElementById("gameOverSound").play();
        }

        if(this.onBonus(queue)){
            var snakeCollision;
            // todo: revoir cette detection en choisissant parmis une liste de cases vides
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
            // créée un nouvel élément à la fin de la liste
            this.elements.push(new Element(old.x,old.y,old.z));
            this.score();
        }

        queue.init();

        // ajoute l'élément au début de la liste
        this.elements.unshift(queue);
    }

    draw(){
        this.bonus.draw();
        this.elements.forEach(function(elem){
            elem.draw();
        });
    }

    animate(){
        var snake=this;
        ANIMATION = setInterval(function(){
            snake.move();
        }, 500);
    }
}
