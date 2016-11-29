class Drawable{
	constructor(size){
		this.vertexBuffer = null;
		this.indexBuffer = null;
		this.colorBuffer = null;
		
		//Creation of a movement matrix specific for the object
		this.mvMatrix = mat4.create();
		
		/*
		glContext.POINTS: Draws a single dot.
		glContext.LINE_STRIP: Draws a straight line to the next vertex.
		glContext.LINE_LOOP: Draws a straight line to the next vertex, and connects the last vertex back to the first.
		glContext.LINES: Draws a line between a pair of vertices.
		glContext.TRIANGLE_STRIP
		glContext.TRIANGLE_FAN
		glContext.TRIANGLES: Draws a triangle for a group of three vertices.
		*/
	}
	
	draw(){
		
		glContext.uniformMatrix4fv(prg.mvMatrixUniform, false, this.mvMatrix);
		glContext.bindBuffer(glContext.ARRAY_BUFFER, this.vertexBuffer);
		glContext.vertexAttribPointer(prg.vertexPositionAttribute, 3, glContext.FLOAT, false, 0, 0);
		glContext.bindBuffer(glContext.ARRAY_BUFFER, this.colorBuffer);
		glContext.vertexAttribPointer(prg.colorAttribute, 4, glContext.FLOAT, false, 0, 0);
		glContext.bindBuffer(glContext.ELEMENT_ARRAY_BUFFER, this.indexBuffer);

		glContext.drawElements(this.mode, this.indices.length, glContext.UNSIGNED_SHORT,0);
	}
	
}

class Grid extends Drawable{
	constructor(size){
		super();
		this.size = size;
		this.init();
		this.mode=3;
	}
	
	init(){
		//Initialisation of the arrays used to construct the object
		this.indices = [];
		this.vertices = [];
		this.colors = [];
		
		var s=this.size;
	 
		this.vertices.push(0,0,0);    
		this.vertices.push(s,0,0);   
		this.vertices.push(s,0,s);
		this.vertices.push(0,0,s);  
		this.vertices.push(0,s,0);
		this.vertices.push(s,s,0);  
		this.vertices.push(s,s,s); 
		this.vertices.push(0,s,s); 

		this.colors.push(1.0, 0.0, 0.0, 1.0);
		this.colors.push(1.0, 1.0, 0.0, 1.0);
		this.colors.push(0.0, 1.0, 0.0, 1.0);
		this.colors.push(0.0, 0.0, 0.0, 1.0);
		this.colors.push(1.0, 0.0, 1.0, 1.0);
		this.colors.push(1.0, 1.0, 1.0, 1.0);
		this.colors.push(0.0, 1.0, 1.0, 1.0);
		this.colors.push(0.0, 0.0, 1.0, 1.0);

		this.indices.push(0,1,2,3,0,4,5,6,7,4,5,1,2,6,7,3);

		this.vertexBuffer = getVertexBufferWithVertices(this.vertices);
		this.colorBuffer  = getVertexBufferWithVertices(this.colors);
		this.indexBuffer  = getIndexBufferWithIndices(this.indices);
	}
}

class Cube extends Drawable{
	constructor(x,y,z){
		super();
		this.x=x;
		this.y=y;
		this.z=z;
		this.mode = glContext.TRIANGLES;
		this.init();
	}
	
	init(){
		this.indices = [];
		this.vertices = [];
		this.colors = [];
		
		var x = this.x;
		var y = this.y;
		var z = this.z;
		
		var v0=[x+0, y+0, z+0],
			v1=[x+1, y+0, z+0],
			v2=[x+1, y+0, z+1],
			v3=[x+0, y+0, z+1],
			v4=[x+0, y+1, z+0],
			v5=[x+1, y+1, z+0],
			v6=[x+1, y+1, z+1],
			v7=[x+0, y+1, z+1];

        this.vertices = [].concat(
            v0,v1,v2,v0,v2,v3, //sol
            v0,v4,v7,v0,v7,v3, // gauche
            v0,v1,v5,v0,v5,v4, // fond
            v1,v2,v6,v1,v6,v5, // droite
            v4,v5,v6,v6,v4,v7, // haut
            v7,v6,v3,v3,v6,v2  // devant
        );
        /*
		this.vertices.push(x+0, y+0, z+0);
		this.vertices.push(x+1, y+0, z+0);
		this.vertices.push(x+1, y+0, z+1);
		this.vertices.push(x+0, y+0, z+1);
		this.vertices.push(x+0, y+1, z+0);
		this.vertices.push(x+1, y+1, z+0);
		this.vertices.push(x+1, y+1, z+1);
		this.vertices.push(x+0, y+1, z+1);
		*/

		var a=1.0;
		var red =    [1.0, 0.0, 0.0, a];
		var yellow = [1.0, 1.0, 0.0, a];
		var green  = [0.0, 1.0, 0.0, a];
		var black  = [0.0, 0.0, 0.0, a];
		var violet = [1.0, 0.0, 1.0, a];
		var white  = [1.0, 1.0, 1.0, a];
		var cyan   = [0.0, 1.0, 1.0, a];
		var blue   = [0.0, 0.0, 1.0, a];

        [red,yellow,green,violet,cyan,blue].forEach(function(color){
            // chaque face a 6 vertices, on applique cette couleur six fois
            for(var i=0;i<6;i++){
                this.colors = this.colors.concat(color);
            }
        },this);


        /*
        for(var i=0;i<this.vertices.length/3;i++){
            //this.colors = this.colors.concat(red);
            this.colors.push(1.0, 0.0, 0.0, a);
        }
        */


		//this.colors = this.colors.concat(black,black,black,black,cyan,cyan,cyan,cyan);

        /*
		this.indices.push(0,1,2,0,2,3); // sol
		this.indices.push(0,4,7,0,7,3); // gauche
		this.indices.push(0,1,5,0,5,4); // fond
		this.indices.push(1,2,6,1,6,5); // droite
		this.indices.push(4,5,6,6,4,7); // haut
		this.indices.push(7,6,3,3,6,2); // devant
		*/
        console.log(this.vertices.length/3)
        for(var i=0;i<6*6;i++){
            this.indices.push(i);
        }

		
		this.vertexBuffer = getVertexBufferWithVertices(this.vertices);
		this.colorBuffer  = getVertexBufferWithVertices(this.colors);
		this.indexBuffer  = getIndexBufferWithIndices(this.indices);
	}
}