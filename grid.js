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
		this.mode=2;
	}
	
	init(){
		//Initialisation of the arrays used to construct the object
		this.indices = [];
		this.vertices = [];
		this.colors = [];
		
		var s=this.size;
	
		this.vertices.push(0,0,s);   
		this.vertices.push(s,0,s);   
		this.vertices.push(s,0,0);  
		this.vertices.push(0,0,0);   
		this.vertices.push(0,s,s);   
		this.vertices.push(s,s,s); 
		this.vertices.push(s,s,0); 
		this.vertices.push(0,s,0);


		this.colors.push(1.0, 0.0, 0.0, 1.0);
		this.colors.push(1.0, 1.0, 0.0, 1.0);
		this.colors.push(0.0, 1.0, 0.0, 1.0);
		this.colors.push(0.0, 0.0, 0.0, 1.0);
		this.colors.push(1.0, 0.0, 1.0, 1.0);
		this.colors.push(1.0, 1.0, 1.0, 1.0);
		this.colors.push(0.0, 1.0, 1.0, 1.0);
		this.colors.push(0.0, 0.0, 1.0, 1.0);

		this.indices.push(4,0,1,4,5,1,6,5,4,6,7,4,0,7,3,0,1,3,2,1,6,2,3,6,7,3);

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
		this.mode = 6;
		this.init();
	}
	
	init(){
		this.indices = [];
		this.vertices = [];
		this.colors = [];
		
		var x = this.x;
		var y = this.y;
		var z = this.z;
	
		this.vertices.push(x+0, y+0, z+1);   
		this.vertices.push(x+1, y+0, z+1);   
		this.vertices.push(x+1, y+0, z+0);  
		this.vertices.push(x+0, y+0, z+0);   
		this.vertices.push(x+0, y+1, z+1);   
		this.vertices.push(x+1, y+1, z+1); 
		this.vertices.push(x+1, y+1, z+0); 
		this.vertices.push(x+0, y+1, z+0);


		this.colors.push(1.0, 0.0, 0.0, 0.5);
		this.colors.push(1.0, 1.0, 0.0, 0.5);
		this.colors.push(0.0, 1.0, 0.0, 0.5);
		this.colors.push(0.0, 0.0, 0.0, 0.5);
		this.colors.push(1.0, 0.0, 1.0, 0.5);
		this.colors.push(1.0, 1.0, 1.0, 0.5);
		this.colors.push(0.0, 1.0, 1.0, 0.5);
		this.colors.push(0.0, 0.0, 1.0, 0.5);

		this.indices.push(4,0,1,4,5,1,6,5,4,6,7,4,0,7,3,0,1,3,2,1,6,2,3,6,7,3);

		this.vertexBuffer = getVertexBufferWithVertices(this.vertices);
		this.colorBuffer  = getVertexBufferWithVertices(this.colors);
		this.indexBuffer  = getIndexBufferWithIndices(this.indices);
	}
}