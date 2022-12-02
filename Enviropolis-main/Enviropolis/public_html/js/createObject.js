class Obje{
    constructor(){
        
        // buffers need these arrays
        this.pointsData = [];
        this.normalData = [];
        this.textCoordData = [];
        
        this.textureObjectArray = [];
        this.faceSizeArray = [];
        
        this.tBufferArray = [];
        this.vBufferArray = [];
        this.nBufferArray = [];
        
        // all materials in mtl file
        this.materialObjArray = [];
        
        // this image array will fill in app
        // it has all images in the one div
        this.imageArray = [];
        
        // this fills in the obj parser with usemtl
        this.orderedImageArray = [];
        
        // generals namespace for the obje
        this.name = "default";
        this.numberOfVertices = 0;
        this.matrix = mat4();
        this.drawType;
        this.position = vec3();
        this.materialCount = 0;
        this.id=-1;
        this.selected = false;
        
    }// constructor
    
    // a method to change the location of the object
    translate (pos){
        this.matrix = mult(this.matrix, translate(pos));
    };

    spawnPosition(pos){
        this.matrix = mult(mat4(),translate(pos));
    };

    rotate (degre){
        this.matrix = mult(this.matrix, rotateY(degre)); 
    };
    
    getPosition(){
        return vec2(this.matrix[0][3], this.matrix[2][3]);
    }
    
    getName() {
        console.log(this.name);
    }
    
    setName(x){
        this.name = x;
    }
    
    buffersData (){

        var preIndex = 0;
        var ındex = 0;


        for (var i = 0; i < this.materialCount; i++) {

            ındex = preIndex + (this.faceSizeArray[i+1])*3 ;
            // create point,normal and texture datas
            let tdata = this.textCoordData.slice(preIndex,ındex);
            let pdata = this.pointsData.slice(preIndex,ındex);
            let ndata = this.normalData.slice(preIndex,ındex);

            // create vertex buffer
            let vBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, flatten(pdata), gl.STATIC_DRAW);

            // create normal buffer
            let nBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, nBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, flatten(ndata), gl.STATIC_DRAW);

            // create texture buffer
            let tBuffer = gl.createBuffer();
            gl.bindBuffer( gl.ARRAY_BUFFER, tBuffer );
            gl.bufferData( gl.ARRAY_BUFFER, flatten(tdata), gl.STATIC_DRAW );

            // create texture obje
            let texture = gl.createTexture();
            gl.bindTexture( gl.TEXTURE_2D, texture );
            gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);

            // change source of image
            gl.texImage2D( gl.TEXTURE_2D, 0, gl.RGB, 
                gl.RGB, gl.UNSIGNED_BYTE, this.orderedImageArray[i] );

            /*
            gl.generateMipmap( gl.TEXTURE_2D );

            gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, 
                      gl.NEAREST_MIPMAP_LINEAR );

            gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST );
            */
            //gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            //gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);

            // push buffers and texture 
            this.textureObjectArray.push(texture);
            this.tBufferArray.push(tBuffer);
            this.vBufferArray.push(vBuffer);
            this.nBufferArray.push(nBuffer);

            preIndex = ındex;
        }
    };
    
    // parse the .obj file with o,v,vt,vn,f,usemtl
    parseObjFile(text){

        // fill these arrays with obj file
        var pointsArray = [];
        var textureArray = [];
        var normalArray = [];

        // some objects have multiple materials we need a seperator 
        var faceSize=0;

        var lines = text.split("\n");

        // every word in one single line
        var word;

        // in the face part 
        // f 1062/1715/259 1051/1723/259 1068/1725/259
        // f vertex1/texture1/normal1 vertex2/texture2/normal2 vertex3/texture3/normal3 
        var firstVertexIndex,secondVertexIndex,thirdVertexIndex;
        var firstTexIndex,secondTexIndex,thirdTexIndex;
        var firstNormalIndex,secondNormalIndex,thirdNormalIndex;

        for (var i = 0 ; i < lines.length; i++) {

            word = lines[i].split(" ");
            
            if(word[0] === 'o'){
                this.name = word[1];
            }
            
            // get vertex and fill the pointsArray
            if(word[0] === 'v'){

                pointsArray.push(vec4(
                        parseFloat(word[1]),
                        parseFloat(word[2]),
                        parseFloat(word[3]),
                        1.0)
                        );
            }

            // fill the texture array
            if(word[0] === "vt"){
                textureArray.push(vec2(
                        parseFloat(word[1]),
                        parseFloat(word[2])
                        ));
            }

            // fil the normal array
            if(word[0] === "vn"){
                normalArray.push(vec3(
                        parseFloat(word[1]),
                        parseFloat(word[2]),
                        parseFloat(word[3])
                        ));
            }

            if(word[0] === "usemtl"){
                this.materialCount += 1;
                this.faceSizeArray.push(faceSize);
                faceSize = 0;

                for (var j = 0; j < this.imageArray.length; j++) {
                    if(this.imageArray[j].alt === word[1]){
                        this.orderedImageArray.push(this.imageArray[j]);
                        break;
                    }
                }

            }

            // we need data to send GPU, generate this data in here
            if(word[0] === 'f'){
                this.numberOfVertices += 3 ;
                faceSize += 1;

                // get vertex data for buffers
                firstVertexIndex = word[1].split("/")[0];
                secondVertexIndex = word[2].split("/")[0];
                thirdVertexIndex = word[3].split("/")[0];

                this.pointsData.push(pointsArray[firstVertexIndex-1]);
                this.pointsData.push(pointsArray[secondVertexIndex-1]);
                this.pointsData.push(pointsArray[thirdVertexIndex-1]);

                // get texture data for buffers
                firstTexIndex = word[1].split("/")[1];
                secondTexIndex = word[2].split("/")[1];
                thirdTexIndex = word[3].split("/")[1];

                this.textCoordData.push(textureArray[firstTexIndex-1]);
                this.textCoordData.push(textureArray[secondTexIndex-1]);
                this.textCoordData.push(textureArray[thirdTexIndex-1]);

                // get normal data for buffers
                firstNormalIndex = word[1].split("/")[2];
                secondNormalIndex = word[2].split("/")[2];
                thirdNormalIndex = word[3].split("/")[2];

                this.normalData.push(normalArray[firstNormalIndex-1]);
                this.normalData.push(normalArray[secondNormalIndex-1]);
                this.normalData.push(normalArray[thirdNormalIndex-1]);

            }                
        }
        this.faceSizeArray.push(faceSize);
        
    };
    
    
        // create material data from .mlt file
    createMTLData(text){

        const lines = text.split("\n");
        var word;
        let materialObj = {};

        for (let i = 0 ; i < lines.length; i++) {
            // 
            word = lines[i].split(" ");

            if(word[0] === "newmtl"){


                // skip the none materials
                if(word[1] === "None"){
                    continue;
                }

                materialObj.name = word[1];

            }

            if(word[0] === "map_Kd"){                    
                // get the last element of the source
                // ex: map_Kd C:\\Users\\Ali\\Desktop\\textures\\ciudadortogonal-ACONDICIONADORes.png
                // get .png part ==> w = ciudadortogonal-ACONDICIONADORes.png
                var w = word[word.length - 1].split("\\");
                let str = "textures/";
                materialObj.source = str.concat(w[w.length - 1]);
                this.materialObjArray.push(Object.assign({},materialObj));
            }

            //
            // other material proporty come here
            //
        }

    };
    
}// class


class Car extends Obje{
    constructor(){
        super();
        this.currentNode;
        this.destinationNode;
        
        this.routeIdArray = [];
        this.next = false;
        this.index = 0;
        this.currentDirection = [0,1];
        
        this.speed = 5;
        this.isMoving = false;
        this.hasJob = false;
        
        this.cargo = "";
        this.isLoad = false;
        this.onClickPos;
        
        this.recentlyFocus = false;
        
        this.angle=0;
    }
   
   
    /* 0: empty (source)
     * 6:10 ==> (destionation)
     * 10:0 
     * 
     *  10,
     */
    
    createRoute(sourceNode,destinationNode){
        this.routeIdArray = [];
        let parent = bellmanFord(graph,sourceNode);     
        // push destination id once
        let currentId = destinationNode.id;
        this.routeIdArray.push(currentId);
        
        for (var i = 0; i < parent.length; i++) {
            currentId = parent[currentId];
            if(currentId === sourceNode.id){
                break;
            }
            this.routeIdArray.push(currentId);
        }
        
        this.index = this.routeIdArray.length-1;
        
        // for the first rotate when the action start
        // only execute one per user instruction
        
        let newDirection = subtract(graph.nodes.get(this.routeIdArray[this.index]).position , this.currentNode.position);
        newDirection = norm(newDirection);
       
        // for 3 d cross product add one dimention
        newDirection[2] = 0.0 ;
        this.currentDirection[2] = 0.0;
        let crossP = cross(newDirection,this.currentDirection);
        let turnDegre = degrees(Math.asin(magnitude(cross(newDirection,this.currentDirection))));

        if(magnitude(add(newDirection,this.currentDirection)) < Math.sqrt(2) ){
            turnDegre = 180 - turnDegre;
        }

        if(crossP[2] < 0){
            turnDegre = -turnDegre;
        }

        this.rotate(turnDegre);
        this.angle += turnDegre;
        
        this.currentDirection = newDirection;
    }
    
    
    
    move( sourceNode,destinationNode,deltaTime){
        
        // get the moving direction and normalize it
        let direction = subtract( destinationNode.position, sourceNode.position);
        direction = norm(direction);
            
        // translate the car with a speed 
        // to move global coordinates back the 
        this.rotate(-this.angle);
        this.translate(vec3(direction[0] * deltaTime * this.speed,0,direction[1] *deltaTime * this.speed ));
        this.rotate(this.angle);
         
        let currentX = this.matrix[0][3];
        let currentY = this.matrix[2][3];
        
        let x,y;
        x = currentX - destinationNode.position[0];
        y = currentY - destinationNode.position[1];
        
        // when the car close enough to the destination node then rotate and change the next and current node
        if( Math.sqrt(x*x + y*y) <= 0.4){
            if(this.index > 0){            
                               
                let newDirection = subtract(graph.nodes.get(this.routeIdArray[this.index-1]).position , destinationNode.position);
                newDirection = norm(newDirection);
                
                this.currentDirection = newDirection;
                
                // for 3 d cross product add one dimention
                newDirection[2] = 0.0;
                direction[2] = 0.0;
                let crossP = cross(newDirection,direction);
                let turnDegre = degrees(Math.asin(magnitude(cross(newDirection,direction))));
                
                if(magnitude(add(newDirection,direction)) < Math.sqrt(2) ){
                    turnDegre = 180 - turnDegre;
                }
                
                if(crossP[2] < 0){
                    turnDegre = -turnDegre;
                }
                
                this.rotate(turnDegre);
                this.angle += turnDegre;
                
            }
            this.next = true;
            this.currentNode = destinationNode;
        }       
    }
       
}

class Building extends Obje{
    constructor(){
        super();
        this.angleX=0;
        this.angleZ=0;
        this.angleY=0;
        this.translateY=0;
        this.translateX=0;
        this.translateZ=0;
        this.angle=0;
        
        this.originalMatrix;
    }
    
    transform(rotateXValue,rotateYValue,rotateZValue,translateXValue,translateYValue,translateZValue){
        let x = mult(mat4(),this.originalMatrix);
        
        x = mult(x,rotateY(-this.angle));
        x = mult(x,translate(translateXValue,0,0));
        x = mult(x,translate(0,translateYValue,0));
        x = mult(x,translate(0,0,translateZValue));
        x = mult(x,rotateY(this.angle));        
        
        x = mult(x,rotateX(rotateXValue));        
        x = mult(x,rotateY(rotateYValue));
        x = mult(x,rotateZ(rotateZValue));
       
        this.translateX = translateXValue;
        this.translateY = translateYValue;
        this.translateZ = translateZValue;
        this.angleX = rotateXValue;
        this.angleY = rotateYValue;
        this.angleZ = rotateZValue;
        
        this.matrix = mult(mat4(),x);
        
    }
    
   
    
}
