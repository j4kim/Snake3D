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
        }
        if(this.onBonus(queue)){
            var snakeCollision;
            // todo: revoir cette detection en choisissant parmis une liste de cases vides
            do{
                this.bonus.x = randint(SIZE);
                this.bonus.y = randint(SIZE);
                this.bonus.z = randint(SIZE);
                snakeCollision = this.elements.some(function(elem){
                    return (elem.x==this.bonus.x && elem.y==this.bonus.y && elem.z==this.bonus.z)
                });
            }while(!snakeCollision);
            this.bonus.init();
            this.elements.push(new Element(old.x,old.y,old.z));
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
