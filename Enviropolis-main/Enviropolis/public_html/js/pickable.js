let pickingIdIndex = 0;
let squarePlaneCount = 0;

function fillSelectableObjArray(text){
    
    text = text.toString();
    let lines = text.split("\n");
    var word;
    
    let pointsArray = [];
    
    // in the face part 
    // f 1062/1715/259 1051/1723/259 1068/1725/259
    // f vertex1/texture1/normal1 vertex2/texture2/normal2 vertex3/texture3/normal3 
    var firstVertexIndex,secondVertexIndex,thirdVertexIndex;
    
    let obj;
    
    for (var i = 0 ; i < lines.length; i++) {

            word = lines[i].split(" ");
            
            if(word[0] === 'o'){
                
                // in the second 'o' command fill the obj and create new one
                if(i > 2){
                    
                    pickingIdIndex++;
                    squarePlaneCount++;
                    
                    // give the object an id
                    obj.id = vec4(
                        ((pickingIdIndex >>  0) & 0xFF) / 0xFF,
                        ((pickingIdIndex >>  8) & 0xFF) / 0xFF,
                        ((pickingIdIndex >> 16) & 0xFF) / 0xFF,
                        ((pickingIdIndex >> 24) & 0xFF) / 0xFF
                    );
                    
                    // get the position of the object
                    
                    obj.materialCount = 1;
                    
                    // fillVertexBuffersData
                    // 
                    // create vertex buffer
                    let vBuffer = gl.createBuffer();
                    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
                    gl.bufferData(gl.ARRAY_BUFFER, flatten(obj.pointsData), gl.STATIC_DRAW);

                    // push buffers 
                    obj.vBufferArray.push(vBuffer);
                    
                    obj.faceSizeArray = [0,2];
                    selectableObjArray.push(obj);
                }
                
                // create a new obje
                obj = new Obje();
                
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
            
                        // we need data to send GPU, generate this data in here
            if(word[0] === 'f'){

                // get vertex data for buffers
                firstVertexIndex = word[1].split("/")[0];
                secondVertexIndex = word[2].split("/")[0];
                thirdVertexIndex = word[3].split("/")[0];
                        
                obj.position[0] = pointsArray[firstVertexIndex-1][0];
                obj.position[1] = pointsArray[firstVertexIndex-1][1];
                obj.position[2] = pointsArray[firstVertexIndex-1][2];
                
            
                obj.pointsData.push(pointsArray[firstVertexIndex-1]);
                obj.pointsData.push(pointsArray[secondVertexIndex-1]);
                obj.pointsData.push(pointsArray[thirdVertexIndex-1]);
                
            }
    }// for 
    
}// func