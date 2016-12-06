
class Snake{
    constructor(start, size){
        this.size=size;
        this.elements=[];
        var x=start[0],y=start[1],z=start[2];
        for(var i=0;i<size;i++){
            this.elements.push(new Element(x-i,y,z));
        }

        // initialisation d'un tableau 3d de dimension size
        this.taken = [];
        for(var i=0;i<SIZE;i++){
            this.taken[i]=[];
            for(var j=0;j<SIZE;j++){
                this.taken[i][j]=[];
                for(var k=0;k<SIZE;k++){
                    this.taken[i][j][k] = false;
                }
            }
        }
    }

    collision(e){
        var snakeCollision = this.elements.some(function(elem){
            return (elem.x==e.x && elem.y==e.y && elem.z==e.z)
        });
        var wallCollision = !(e.x<SIZE && e.x >= 0 && e.y<SIZE && e.y >= 0 && e.z<SIZE && e.z >= 0);
        return snakeCollision || wallCollision;
    }

    move(i,j,k){
        var queue = this.elements.pop();
        var tete = this.elements[0];
        queue.x = tete.x + i;
        queue.y = tete.y + j;
        queue.z = tete.z + k;

        // check for collisions
        if(this.collision(queue)){
            console.log("collision");
            clearInterval(ANIMATION);
        }

        queue.init();
        // ajoute l'élément au début de la liste
        this.elements.unshift(queue);
    }

    draw(){
        this.elements.forEach(function(elem){
            elem.draw();
        });
    }
}
