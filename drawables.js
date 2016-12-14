
var a = 1.0;
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
		this.mvMatrix = mat4.create();
		
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

        this.a = 1.0;
        this.red =    [1.0, 0.0, 0.0, this.a];
        this.yellow = [1.0, 1.0, 0.0, this.a];
        this.green  = [0.0, 1.0, 0.0, this.a];
        this.black  = [0.0, 0.0, 0.0, this.a];
        this.violet = [1.0, 0.0, 1.0, this.a];
        this.white  = [1.0, 1.0, 1.0, this.a];
        this.cyan   = [0.0, 1.0, 1.0, this.a];
        this.blue   = [0.0, 0.0, 1.0, this.a];
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
        [this.red, this.yellow, this.green, this.violet, this.cyan, this.blue].forEach(function(color){
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
		glContext.uniformMatrix4fv(prg.mvMatrixUniform, false, this.mvMatrix);
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
        this.vertices.splice(-6*3,6*3);
        super.init2();
	}
}

class Element extends Cube{
	constructor(x,y,z){
		super();
		this.x=x;
		this.y=y;
		this.z=z;
        this.a=.1;
		this.init();
	}
}

class Bonus extends Element{
    init2(){
			[white,white,white,white,white,white].forEach(function(color){
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