var canvas;
var gl;

let phongShaders = true;

var objArray = [];
var selectableObjArray = [];
var selectedObjeId = -1;
var selectableObjeCount = 0;
let carCount = 0;
let tree1Count = 0;
let tree2Count = 0;
let tree3Count = 0;
let windmillCount = 0;
let solar1Count = 0;
let solar2Count = 0;
let totalMoney = 40000;
const factoryCount = 2;

const tree1Price = 200;
const tree2Price = 300;
const tree3Price = 500;
const windmillPrice = 5000;
const solar1Price = 7000;
const solar2Price = 3000; 
const carPrice = 1000;

// how many points is given to user in one second 
const tree1Value = 0.5;
const tree2Value = 1;
const tree3Value = 2;
const windmillValue = 13.5;
const solar1Value = 18.5;
const solar2Value = 8;

// how many 
const tree1air = 1;
const tree2air = 1;
const tree3air = 1;
const windmillEnergy = 3;
const solar1Energy = 4;
const solar2Energy = 2;

let airBarWidth = 25;
let energyBarWidth = 25;

let baseNode;

var program;
var pickingProgram;

var frameBuffer;

let renderFlag = false;
let clipX,clipY;

var then = 0;
var deltaTime;// = 0.0166;
let getDeltaTimeCount = 0;
let time = 0;
let time2 = 0;

var near = 0.3;
var far = 100.0;

var radius = 4.0;
var theta  = -0.5;
var phi    = 90.3;
var dr = 5.0 * Math.PI/180.0;

var  fovy = 45.0;  
var  aspect = 1.0; 

var modelViewMatrix = mat4();
var projectionMatrix = mat4();

/*
var modelViewMatrixLoc, projectionMatrixLoc, u_matrixLoc;
var vPositionLoc, vColorLoc, vTexCoordLoc, vNormalLoc, samplerLoc;
var ambientProductLoc,diffuseProductLoc,specularProductLoc,shininessLoc,lightPositionLoc;
var ambientProduct,diffuseProduct,specularProduct;
var atLoc,selectingColorFactorLoc;

var modelViewMatrixPickingLoc, projectionMatrixPickingLoc, u_matrixPickingLoc;
var vPositionPickingLoc, u_idPickingLoc,angleLoc,lightIntensityLoc;
*/

// light and material part
let lightIsOpen = true;
let lightIntensity = 10.0;
let lightPosition = vec3( -35.5,95,16.5);
const originalLightPosition = vec3( -35.5,95,16.5);
var lightAmbient = vec4(0.2, 0.2, 0.2, 1.0 );
var lightDiffuse = vec4(1.0, 1.0, 1.0, 1.0 );
var lightSpecular = vec4( 1.0, 1.0, 1.0, 1.0 );

var materialAmbient = vec4( 1.0, 1.0, 1.0, 1.0 );
var materialDiffuse = vec4( 0.8, 0.8, 0.8, 1.0);
var materialSpecular = vec4( 0.5, 0.5, 0.5, 1.0 );

var materialShininess = 100.0;

var angle = Math.cos(radians(150));

var ambientColor, diffuseColor, specularColor;

// camera part
var cameraTransform = vec3(-29.5,-30,38.5);

var eye = vec3(0.0, 0.0, 0.0);
var at = vec3(0.0, 0.0, 0.0);
const up = vec3(0.0, 1.0, 0.0);

let at2 = vec3(radius*Math.cos(-1.4389134761801987)*Math.cos(89.68913476180188), 
    radius*Math.sin(-1.4389134761801987),
    radius*Math.cos(-1.4389134761801987) * Math.sin(89.68913476180188)
            );

const cityObject = new Obje();
const carObject = new Car();
const factoryObject = new Building();
const tree1Object = new Building();
const tree2Object = new Building();
const tree3Object = new Building();
const windmillObject = new Building();
const solarPanel1Object = new Building();
const solarPanel2Object = new Building();


window.onload = async function init() {
    
    interface();
    
    // get canvas and prepare it 
    canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL2 isn't available" ); }

    canvas.width = document.documentElement.clientWidth;    
    canvas.height = document.documentElement.clientHeight;
    
    gl.viewport( 0, 0, canvas.width, canvas.height );

    aspect =  canvas.width/canvas.height;
   
    gl.clearColor( 0.0, 0.0,0.15, 1.0 );
    gl.enable(gl.DEPTH_TEST);

    //
    //  Load shaders and initialize attribute buffers for general
    //
    program = initShaders( gl, "vertex-shader", "fragment-shader" );
    
    // get locations of the attributes which is in the shaders
    vTexCoordLoc = gl.getAttribLocation( program, "vTexCoord" );
    vPositionLoc = gl.getAttribLocation( program, "vPosition" );
    vNormalLoc = gl.getAttribLocation(program, "vNormal");
    modelViewMatrixLoc = gl.getUniformLocation( program, "modelViewMatrix" );
    projectionMatrixLoc = gl.getUniformLocation( program, "projectionMatrix" );
    u_matrixLoc = gl.getUniformLocation(program,"u_matrix");
    samplerLoc = gl.getUniformLocation(program, "sampler");
    ambientProductLoc = gl.getUniformLocation(program, "ambientProduct");
    diffuseProductLoc = gl.getUniformLocation(program, "diffuseProduct");
    specularProductLoc = gl.getUniformLocation(program, "specularProduct");
    shininessLoc = gl.getUniformLocation(program,"shininess");
    lightPositionLoc = gl.getUniformLocation(program, "lightPosition");
    atLoc = gl.getUniformLocation(program,"at");
    selectingColorFactorLoc = gl.getUniformLocation(program,"selectingColorFactor");
    angleLoc = gl.getUniformLocation(program,"angle");
    lightIntensityLoc = gl.getUniformLocation(program,"lightIntensity");
    
    ambientProduct = mult(lightAmbient, materialAmbient);
    diffuseProduct = mult(lightDiffuse, materialDiffuse);
    specularProduct = mult(lightSpecular, materialSpecular);
    
    //
    //  Load shaders and initialize attribute buffers for second program
    //
    program2 = initShaders( gl, "vertex-shader2", "fragment-shader2" );
    
    // get locations of the attributes which is in the shaders
    vTexCoordLoc2 = gl.getAttribLocation( program2, "vTexCoord" );
    vPositionLoc2 = gl.getAttribLocation( program2, "vPosition" );
    vNormalLoc2 = gl.getAttribLocation(program2, "vNormal");
    modelViewMatrixLoc2 = gl.getUniformLocation( program2, "modelViewMatrix" );
    projectionMatrixLoc2 = gl.getUniformLocation( program2, "projectionMatrix" );
    u_matrixLoc2 = gl.getUniformLocation(program2,"u_matrix");
    samplerLoc2 = gl.getUniformLocation(program2, "sampler");
    lightPositionLoc2 = gl.getUniformLocation(program2, "lightPosition");
    atLoc2 = gl.getUniformLocation(program2,"at");
    selectingColorFactorLoc2 = gl.getUniformLocation(program2,"selectingColorFactor");
    angleLoc2 = gl.getUniformLocation(program2,"angle");
    lightIntensityLoc2 = gl.getUniformLocation(program2,"lightIntensity");
    toggleLightLoc = gl.getUniformLocation(program2,"toggleLight"); 
    
    
    //
    //  Load shaders and initialize attribute buffers for picking objects
    //
    pickingProgram = initShaders( gl, "pickingVS", "pickingFS" );
    
    vPositionPickingLoc = gl.getAttribLocation( pickingProgram, "vPosition" );
    modelViewMatrixPickingLoc = gl.getUniformLocation( pickingProgram, "modelViewMatrix" );
    projectionMatrixPickingLoc = gl.getUniformLocation( pickingProgram, "projectionMatrix" );
    u_matrixPickingLoc = gl.getUniformLocation(pickingProgram,"u_matrix");
    u_idPickingLoc = gl.getUniformLocation(pickingProgram,"u_id");
    
    // ********** create objects ************
    const response = await fetch('objects/real-city1.obj');  
    const cityObj = await response.text();
    
    const response2 = await fetch('objects/real-city1.mtl');
    const cityMtl = await response2.text();
    
    const response3 = await fetch('objects/car.obj');  
    const carObj = await response3.text();
    
    const response4 = await fetch('objects/car.mtl');
    const carMtl = await response4.text();
    
    // to create Graph use node file
    const response5 = await fetch('objects/real-node1.obj');
    const nodeText = await response5.text();
    createGraphByNodeFile(nodeText);
    baseNode = graph.nodes.get(54);
    
    let lmat = lookAt(originalLightPosition,at2,up);
    at2 = [-lmat[2][0], -lmat[2][1],-lmat[2][2]];
    
    // fill selectedObjArray(text)
    const response6 = await fetch('objects/pickable.obj');
    const pickText = await response6.text();
    
    const response7 = await fetch('objects/factory.obj');  
    const factoryObj = await response7.text();
    
    const response8 = await fetch('objects/factory.mtl');
    const factoryMtl = await response8.text();
    
    const response9 = await fetch('objects/tree1.obj');  
    const tree1Obj = await response9.text();
    
    const response10 = await fetch('objects/tree1.mtl');
    const tree1Mtl = await response10.text();
    
    const response11 = await fetch('objects/tree2.obj');  
    const tree2Obj = await response11.text();
    
    const response12 = await fetch('objects/tree2.mtl');
    const tree2Mtl = await response12.text();
    
    const response13 = await fetch('objects/tree3.obj');  
    const tree3Obj = await response13.text();
    
    const response14 = await fetch('objects/tree3.mtl');
    const tree3Mtl = await response14.text();
    
    const response15 = await fetch('objects/windmill.obj');  
    const windmillObj = await response15.text();
    
    const response16 = await fetch('objects/windmill.mtl');
    const windmillMtl = await response16.text();
    
    const response17 = await fetch('objects/solar-Panel1.obj');  
    const solarPanel1Obj = await response17.text();
    
    const response18 = await fetch('objects/solar-Panel1.mtl');
    const solarPanel1Mtl = await response18.text();
    
    const response19 = await fetch('objects/solar-Panel2.obj');  
    const solarPanel2Obj = await response19.text();
    
    const response20 = await fetch('objects/solar-Panel2.mtl');
    const solarPanel2Mtl = await response20.text();
    
    setObjeProperties(cityObject,cityObj ,cityMtl);  
    setObjeProperties(carObject,carObj,carMtl);  
    setObjeProperties(factoryObject,factoryObj,factoryMtl);  
    setObjeProperties(tree1Object,tree1Obj,tree1Mtl); 
    setObjeProperties(tree2Object,tree2Obj,tree2Mtl); 
    setObjeProperties(tree3Object,tree3Obj,tree3Mtl); 
    setObjeProperties(windmillObject,windmillObj,windmillMtl);
    setObjeProperties(solarPanel1Object,solarPanel1Obj,solarPanel1Mtl);
    setObjeProperties(solarPanel2Object,solarPanel2Obj,solarPanel2Mtl);
    
    // all selecteable square planes enters the array in this function
    fillSelectableObjArray(pickText);
    
    // build 2 factory on start
    build(factoryObject,vec3(10.6588 ,0,-12.3953),  0);
    build(factoryObject,vec3(-67.0534,0.0,-20.3497),90);
    
    // give the user a car to play
    buyACar();
    // give the start bar width
    airBarDiv.style.width = airBarWidth + "%";
    airBarDiv.textContent = airBarWidth + "%";
    
    energyBarDiv.style.width = energyBarWidth + "%";
    energyBarDiv.textContent = energyBarWidth + "%";

    //
    //  ***************** CREATE FRAME BUFFER AND FILL IT **********************
    //
    {
    // Create a texture to render to
    const targetTexture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, targetTexture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    
    // create a depth renderbuffer
    const depthBuffer = gl.createRenderbuffer();
    gl.bindRenderbuffer(gl.RENDERBUFFER, depthBuffer);
    
    function setFramebufferAttachmentSizes(width, height){
        gl.bindTexture(gl.TEXTURE_2D, targetTexture);
        // define size and format of level 0
        const internalFormat = gl.RGBA;
        const format = gl.RGBA;
        const type = gl.UNSIGNED_BYTE;
        const data = null;
        gl.texImage2D(gl.TEXTURE_2D, 0, internalFormat,
                      width, height, 0,
                      format, type, data);

        gl.bindRenderbuffer(gl.RENDERBUFFER, depthBuffer);
        gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, width, height);
    }
    
    setFramebufferAttachmentSizes(canvas.width,canvas.height);
    
    // Create and bind the framebuffer
    frameBuffer = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, frameBuffer);
    
    // attach the texture as the first color attachment
    const attachmentPoint = gl.COLOR_ATTACHMENT0;
    gl.framebufferTexture2D(gl.FRAMEBUFFER, attachmentPoint, gl.TEXTURE_2D, targetTexture, 0);
   
    // make a depth buffer and the same size as the targetTexture
    gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, depthBuffer);
    
    // *************************** FINIS FRAME BUFFER
    }
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    
    // all listeners in here
    listeners();
    //render();
};

var render = function(now){
    
   
    
    if(getDeltaTimeCount < 10){
        getDeltaTimeCount++;
        // get deltaTime
        now *= 0.001;
        deltaTime = now - then;
        then = now;
    }
    
    if(!renderFlag){
        return;
    }
    
    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.disable(gl.CULL_FACE);
        
    // to give a perspective to the camera    
    projectionMatrix = perspective(fovy, aspect, near, far);
    //projectionMatrix = ortho(-10, 10, -10, 10, -100, 100);
    
    // determine camera position
    at = vec3(radius*Math.cos(theta)*Math.cos(phi), 
        radius*Math.sin(theta),
        radius*Math.cos(theta) * Math.sin(phi)
                );
    modelViewMatrix = lookAt(eye, at, up);
    modelViewMatrix = mult(modelViewMatrix, translate(cameraTransform));
   
    //
    // start drawing
    //
    
    if(phongShaders){
        
    // general camera matrices for all drawing 
    gl.useProgram( program );
    
    gl.uniform4fv(ambientProductLoc, flatten(ambientProduct));
    
    if(lightIsOpen){
        gl.uniform4fv(diffuseProductLoc, flatten(diffuseProduct) );
    }else{
        gl.uniform4fv(diffuseProductLoc, flatten(vec4()) );
    }
    gl.uniform4fv(specularProductLoc, flatten(specularProduct) );	
    gl.uniform1f(shininessLoc ,materialShininess);
    gl.uniform3fv(lightPositionLoc , lightPosition );
    gl.uniform3fv(atLoc,at2);
    gl.uniform1f(angleLoc, angle);
    gl.uniform1f(lightIntensityLoc, lightIntensity);
    gl.uniformMatrix4fv( modelViewMatrixLoc, false, flatten(modelViewMatrix) );
    gl.uniformMatrix4fv( projectionMatrixLoc, false, flatten(projectionMatrix) );
    
    // draw all object in the scene
    objArray.forEach(obj => {
        
 
        if(obj instanceof Car){
            

            // if the car is selected and it has a job then create route of the car
            // start the moving 
            if(obj.selected && obj.hasJob){
                
                // destinationNode !== nearstNode go to the location 
                if((obj.currentNode.position[0] !== obj.destinationNode.position[0]) ||
                            (obj.currentNode.position[1] !== obj.destinationNode.position[1])){
                    // if the car has same destination and current node dont move
                    obj.createRoute(obj.currentNode,obj.destinationNode);
                }else{
                    obj.index = -1;
                }
                
                obj.selected = false;
                obj.isMoving = true;
            }
            
            if(obj.isMoving && !Number.isNaN(deltaTime)){
                
                // destinationNode !== nearstNode go to the location 
                if(obj.index !== -1){
                    // if the car has same destination and current node dont move
                    obj.move(obj.currentNode, graph.nodes.get(obj.routeIdArray[obj.index]),deltaTime);
                }
                
                if(obj.next){
                    obj.index--;
                    obj.next = false;
                }
                
                if(obj.index === -1){
                    obj.isMoving = false;
                    obj.hasJob = false;
                    
                    // build the cargo
                    if(obj.isLoad ){
                        let returnValue;
                        switch (obj.cargo) {
                            case "tree1":
                                returnValue = build(tree1Object,obj.onClickPos,0);
                                if(returnValue){
                                    tree1Count++;
                                    incAirBar(tree1air);
                                    obj.isLoad = false;
                                    obj.cargo = "";
                                }
                                break;
                            case "tree2":
                                returnValue = build(tree2Object,obj.onClickPos,0);
                                if(returnValue){
                                    tree2Count++;
                                    incAirBar(tree2air);
                                    obj.isLoad = false;
                                    obj.cargo = "";
                                }
                                break;   
                            case "tree3":
                                returnValue = build(tree3Object,obj.onClickPos,0);
                                if(returnValue){
                                    tree3Count++;
                                    incAirBar(tree2air);
                                    obj.isLoad = false;
                                    obj.cargo = "";
                                }
                                break
                            case "windmill":
                                returnValue = build(windmillObject,obj.onClickPos,0);
                                if(returnValue){
                                    windmillCount++;
                                    incEnergyBar(windmillEnergy);
                                    obj.isLoad = false;
                                    obj.cargo = "";
                                }
                                break;
                            case "solarPanel1":
                                returnValue = build(solarPanel1Object,obj.onClickPos,0);
                                if(returnValue){
                                    solar1Count++;
                                    incEnergyBar(solar1Energy);
                                    obj.isLoad = false;
                                    obj.cargo = "";
                                }
                                break;
                            case "solarPanel2":
                                returnValue = build(solarPanel2Object,obj.onClickPos,0);
                                if(returnValue){
                                    solar2Count++;
                                    incEnergyBar(solar2Energy);
                                    obj.isLoad = false;
                                    obj.cargo = "";
                                }
                                break;   
                            default:
                                
                                break;
                        }
                        
                    }
                }
            }
        }
        
        gl.uniformMatrix4fv(u_matrixLoc,false,flatten(obj.matrix));
        
        // if the car is selected change the color of the car
        if(obj.selected){
            gl.uniform4fv(selectingColorFactorLoc, vec4(0.6, 1, 0.6 ,1.0));
        }else if(obj instanceof Car && obj.isLoad){
            gl.uniform4fv(selectingColorFactorLoc, vec4(1, 0.6, 0.6 ,1.0));
        }else{
            gl.uniform4fv(selectingColorFactorLoc, vec4(1.0,1.0,1.0,1.0) );
        }
        
        var offset = 0;
        for (var i = 0; i < obj.materialCount; i++) {
            
            gl.bindBuffer(gl.ARRAY_BUFFER, obj.vBufferArray[i]);
            gl.vertexAttribPointer( vPositionLoc, 4, gl.FLOAT, false, 0, 0 );
            gl.enableVertexAttribArray( vPositionLoc );
            
            gl.bindBuffer( gl.ARRAY_BUFFER, obj.nBufferArray[i]);
            gl.vertexAttribPointer( vNormalLoc, 3, gl.FLOAT, false, 0, 0 );
            gl.enableVertexAttribArray( vNormalLoc);

            gl.bindBuffer( gl.ARRAY_BUFFER, obj.tBufferArray[i]);
   
            gl.vertexAttribPointer( vTexCoordLoc, 2, gl.FLOAT, false,0,  offset );
            gl.enableVertexAttribArray( vTexCoordLoc );

            gl.bindTexture( gl.TEXTURE_2D, obj.textureObjectArray[i] ); 

            gl.drawArrays(gl.TRIANGLES ,0,(obj.faceSizeArray[i+1] )*3); 
        }
    });
    }else{
        // *********************************** TOON SHADING *********************************
    // general camera matrices for all drawing 
    gl.useProgram( program2 );
   
    // light is open close ********************************************************* hah
    if(lightIsOpen){
        gl.uniform1f(toggleLightLoc,1.0);
    }else{
        gl.uniform1f(toggleLightLoc,0.0);
    }
    
    gl.uniform3fv(lightPositionLoc2 , lightPosition );
    gl.uniform3fv(atLoc2,at2);
    gl.uniform1f(angleLoc2, angle);
    gl.uniform1f(lightIntensityLoc2, lightIntensity);
    gl.uniformMatrix4fv( modelViewMatrixLoc2, false, flatten(modelViewMatrix) );
    gl.uniformMatrix4fv( projectionMatrixLoc2, false, flatten(projectionMatrix) );
    

    
    // draw all object in the scene
    objArray.forEach(obj => {
        
 
        if(obj instanceof Car){
            

            // if the car is selected and it has a job then create route of the car
            // start the moving 
            if(obj.selected && obj.hasJob){
                
                // destinationNode !== nearstNode go to the location 
                if((obj.currentNode.position[0] !== obj.destinationNode.position[0]) ||
                            (obj.currentNode.position[1] !== obj.destinationNode.position[1])){
                    // if the car has same destination and current node dont move
                    obj.createRoute(obj.currentNode,obj.destinationNode);
                }else{
                    obj.index = -1;
                }
                
                obj.selected = false;
                obj.isMoving = true;
            }
            
            if(obj.isMoving && !Number.isNaN(deltaTime)){
                
                // destinationNode !== nearstNode go to the location 
                if(obj.index !== -1){
                    // if the car has same destination and current node dont move
                    obj.move(obj.currentNode, graph.nodes.get(obj.routeIdArray[obj.index]),deltaTime);
                }
                
                if(obj.next){
                    obj.index--;
                    obj.next = false;
                }
                
                if(obj.index === -1){
                    obj.isMoving = false;
                    obj.hasJob = false;
                    
                    // build the cargo
                    if(obj.isLoad ){
                        let returnValue;
                        switch (obj.cargo) {
                            case "tree1":
                                returnValue = build(tree1Object,obj.onClickPos,0);
                                if(returnValue){
                                    tree1Count++;
                                    incAirBar(tree1air);
                                    obj.isLoad = false;
                                    obj.cargo = "";
                                }
                                break;
                            case "tree2":
                                returnValue = build(tree2Object,obj.onClickPos,0);
                                if(returnValue){
                                    tree2Count++;
                                    incAirBar(tree2air);
                                    obj.isLoad = false;
                                    obj.cargo = "";
                                }
                                break;   
                            case "tree3":
                                returnValue = build(tree3Object,obj.onClickPos,0);
                                if(returnValue){
                                    tree3Count++;
                                    incAirBar(tree2air);
                                    obj.isLoad = false;
                                    obj.cargo = "";
                                }
                                break
                            case "windmill":
                                returnValue = build(windmillObject,obj.onClickPos,0);
                                if(returnValue){
                                    windmillCount++;
                                    incEnergyBar(windmillEnergy);
                                    obj.isLoad = false;
                                    obj.cargo = "";
                                }
                                break;
                            case "solarPanel1":
                                returnValue = build(solarPanel1Object,obj.onClickPos,0);
                                if(returnValue){
                                    solar1Count++;
                                    incEnergyBar(solar1Energy);
                                    obj.isLoad = false;
                                    obj.cargo = "";
                                }
                                break;
                            case "solarPanel2":
                                returnValue = build(solarPanel2Object,obj.onClickPos,0);
                                if(returnValue){
                                    solar2Count++;
                                    incEnergyBar(solar2Energy);
                                    obj.isLoad = false;
                                    obj.cargo = "";
                                }
                                break;   
                            default:
                                
                                break;
                        }
                        
                    }
                }
            }
        }
        
        gl.uniformMatrix4fv(u_matrixLoc2,false,flatten(obj.matrix));
        
        // if the car is selected change the color of the car
        if(obj.selected){
            gl.uniform4fv(selectingColorFactorLoc2, vec4(0.6, 1, 0.6 ,1.0));
        }else if(obj instanceof Car && obj.isLoad){
            gl.uniform4fv(selectingColorFactorLoc2, vec4(1, 0.6, 0.6 ,1.0));
        }else{
            gl.uniform4fv(selectingColorFactorLoc2, vec4(1.0,1.0,1.0,1.0) );
        }
        
        var offset = 0;
        for (var i = 0; i < obj.materialCount; i++) {
            
            gl.bindBuffer(gl.ARRAY_BUFFER, obj.vBufferArray[i]);
            gl.vertexAttribPointer( vPositionLoc2, 4, gl.FLOAT, false, 0, 0 );
            gl.enableVertexAttribArray( vPositionLoc2 );
            
            gl.bindBuffer( gl.ARRAY_BUFFER, obj.nBufferArray[i]);
            gl.vertexAttribPointer( vNormalLoc2, 3, gl.FLOAT, false, 0, 0 );
            gl.enableVertexAttribArray( vNormalLoc2);

            gl.bindBuffer( gl.ARRAY_BUFFER, obj.tBufferArray[i]);
   
            gl.vertexAttribPointer( vTexCoordLoc2, 2, gl.FLOAT, false,0,  offset );
            gl.enableVertexAttribArray( vTexCoordLoc2 );

            gl.bindTexture( gl.TEXTURE_2D, obj.textureObjectArray[i] ); 

            gl.drawArrays(gl.TRIANGLES ,0,(obj.faceSizeArray[i+1] )*3); 
        }
    });
    }
   
   
   
    if(!Number.isNaN(deltaTime)){
        totalMoney +=( 
                (tree1Count*tree1Value*deltaTime) + 
                (tree2Count*tree2Value*deltaTime) +                
                (tree3Count*tree3Value*deltaTime) +
                (windmillCount*windmillValue*deltaTime) +
                (solar1Count*solar1Value*deltaTime) +
                (solar2Count*solar2Value*deltaTime)
                );
        time += deltaTime;
        time2 += deltaTime;
    }

    if(time > 5){
        moneySpan.textContent = totalMoney.toFixed(2);
        time = 0;
    }
    
    if(time2 > 20){
        time2 = 0;
        decAirBar(1);
        decEnergyBar(1);
    }
    
    requestAnimFrame(render);
};

// fill the buffers and get texture images
function setObjeProperties(Obj,text,text2){
    
    // fill the matrialObjArray with materials objects which have names and sources
    Obj.createMTLData(text2);
    // create a div and add to the body
    let images = document.createElement("div");
    document.getElementsByTagName("body")[0].appendChild(images);
    
    // if there is same materials in the materialObject array skip that
    let sourceStringArray = [];
    let nameStringArray = [];
    let cnt = false;
    Obj.materialObjArray.forEach(obj => {    
        // skip same image
        for (var i = 0; i < sourceStringArray.length; i++) {            
            if(sourceStringArray[i] === obj.source && nameStringArray[i] === obj.name){
                cnt = true;
            }
        }
        
        // create an img tag and add to the div for each material object
        if(!cnt){
            sourceStringArray.push(obj.source);
            nameStringArray.push(obj.name);

            let imageTag = document.createElement("img");
            imageTag.setAttribute("src", obj.source);
            imageTag.setAttribute("alt", obj.name);
            imageTag.hidden = true;
            images.appendChild(imageTag);
        }
        
        cnt = false;
    });
    
    setTimeout(hello,3000);
    // wait for the images to load
    function hello(){
        
        // after loading fill the image Array with img tag objects
        var children = images.children;
        for (var i = 0; i < children.length; i++) {
            var tableChild = children[i];
            Obj.imageArray.push(tableChild);
        };
  
        // parse the .obj file with o,v,vt,vn,f,usemtl
        Obj.parseObjFile(text);

        // create buffers for the object
        Obj.buffersData();
        if(Obj instanceof Car || Obj instanceof Building){
            
        }else{
            objArray.push(Obj);
        }
    };
    
    
    

};


function buyACar(){
    let carObject2 = {};
    carObject2.__proto__ = carObject;
    selectableObjeCount++;
    carCount++;
    
    carObject2.spawnPosition(vec3(graph.nodes.get(54).position[0],0,graph.nodes.get(54).position[1]));
    carObject2.currentNode = graph.nodes.get(54);
    carObject2.name = "car";
    
    objArray.push(carObject2);
    selectableObjArray.push(carObject2);
    
    pickingIdIndex++;
    carObject2.id = vec4(
        ((pickingIdIndex >>  0) & 0xFF) / 0xFF,
        ((pickingIdIndex >>  8) & 0xFF) / 0xFF,
        ((pickingIdIndex >> 16) & 0xFF) / 0xFF,
        ((pickingIdIndex >> 24) & 0xFF) / 0xFF
    );
    
    // change the price of the car 
    let p = (carCount+1)*1000;
    carPriceSpan.textContent = p;
    
}

function build(baseObje,pos,rotationDegre){
    
    if(pos === -1){
        return 0;
    }

    //--- factory1
    let copyObje = {};
    copyObje.__proto__ = baseObje;
    selectableObjeCount++;
        
    pickingIdIndex++;
    copyObje.id = vec4(
        ((pickingIdIndex >>  0) & 0xFF) / 0xFF,
        ((pickingIdIndex >>  8) & 0xFF) / 0xFF,
        ((pickingIdIndex >> 16) & 0xFF) / 0xFF,
        ((pickingIdIndex >> 24) & 0xFF) / 0xFF
    );
    
    copyObje.spawnPosition(pos);
    copyObje.position = pos;
    copyObje.rotate(rotationDegre);
    copyObje.originalMatrix = mult(mat4(),copyObje.matrix);
    
    copyObje.name = "building";
    
    objArray.push(copyObje);
    selectableObjArray.push(copyObje);
    
    return 1;
}

function focusSelectedObject(last=0){
    
    /*
        
        camera: -10.6588,-30,12.3953
        app.js:499 phi: 90.04692725846078
        app.js:500 theta: -0.6832595714594049
        app.js:501 camera: -25.6588,-30,42.3953
        
     */
    
    if(selectedObjeId === -1){
        return;
    }
    
    let selectedObj;
    // if the last is 1 then focus the new car which have just bought 
    if(last){
        // select the last object
        selectedObj = selectableObjArray[selectableObjArray.length -1 ];
    }else{
        
        selectedObj = selectableObjArray[selectedObjeId-1];
    }
    
    // return vec2
    let pos = selectedObj.getPosition();
    
    cameraTransform = vec3(-pos[0] -15, -30, -pos[1] + 30);
    phi = 90.04692725846078;
    theta = -0.6832595714594049;
}


// ************************************** CAMERA ************************************
// chane theta and phi to look around the scene via a mouse
function updateRotation(){
    
    theta -= event.movementY * Math.PI/360.0;
    if(theta <= -1.5){
        theta = -1.5;
    }
    
    if(theta >= 1.5){
        theta = 1.5;
    }
    
    phi += event.movementX * Math.PI/360.0;
    
}


function listeners(){
     // add event to + and - button to speed up and down the monkey rotation
    document.addEventListener('keydown', (event) => { 
        
        if(event.key === "c"){
            document.removeEventListener("mousemove", updateRotation,false);
        }
        if(event.key === "v"){
            document.addEventListener("mousemove", updateRotation,false);
        }
        
        if(event.key === "1"){
            phongShaders = !phongShaders;
        }
        
        if(event.key === 'ArrowUp'){
            cameraTransform[2] -= 5;
        }
        
        if(event.key === 'ArrowDown'){
            cameraTransform[2] += 5;
        }
        
        if(event.key === 'ArrowLeft'){
            cameraTransform[0] -= 5;
        }
        
        if(event.key === 'ArrowRight'){
            cameraTransform[0] += 5;
        }
        
        if(event.key === 'PageDown'){
            cameraTransform[1] += 5;
        }
        
        if(event.key === 'PageUp'){
            cameraTransform[1] -= 5;
        }  
    });
                      
    // add an event listener to fix The camera which
    // have to adapt to resizing of the drawing window
    window.addEventListener("resize", displayWindow);
    
    function displayWindow(){
        var w = document.documentElement.clientWidth;
        var h = document.documentElement.clientHeight;
        
        aspect = w/h;
    }
    
    // frame buffer click
    canvas.addEventListener('click', (event)=>{
        
        // determine camera position
        at = vec3(radius*Math.cos(theta)*Math.cos(phi), 
            radius*Math.sin(theta),
            radius*Math.cos(theta) * Math.sin(phi)
                    );
        modelViewMatrix = lookAt(eye, at, up);
        modelViewMatrix = mult(modelViewMatrix, translate(cameraTransform));

        projectionMatrix = perspective(fovy, aspect, near, far);

        // render frame buffer
        gl.bindFramebuffer(gl.FRAMEBUFFER, frameBuffer);
        gl.viewport(0, 0, canvas.width, canvas.height);

        gl.enable(gl.CULL_FACE);
        gl.enable(gl.DEPTH_TEST);

        // Clear the canvas AND the depth buffer.
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        gl.useProgram(pickingProgram);

        // general camera matrices for all drawing 
        gl.uniformMatrix4fv( modelViewMatrixPickingLoc, false, flatten(modelViewMatrix) );
        gl.uniformMatrix4fv( projectionMatrixPickingLoc, false, flatten(projectionMatrix) );

        // draw all selectable objects in the scene 
        selectableObjArray.forEach(obj => {
            
            gl.uniformMatrix4fv(u_matrixPickingLoc ,false,flatten(obj.matrix));
            for (var i = 0; i < obj.materialCount; i++) {
               
                gl.bindBuffer(gl.ARRAY_BUFFER, obj.vBufferArray[i]);
                gl.vertexAttribPointer( vPositionPickingLoc, 4, gl.FLOAT, false, 0, 0 );
                gl.enableVertexAttribArray( vPositionPickingLoc );

                gl.uniform4fv(u_idPickingLoc, obj.id);

                gl.drawArrays(gl.TRIANGLES ,0,(obj.faceSizeArray[i+1] )*3); 
            }

        });

        // get mouse position
        const rect = canvas.getBoundingClientRect();
        const mouseX = event.clientX - rect.left;
        const mouseY = event.clientY - rect.top;

        // ------ read the 1 pixel
        const pixelX = mouseX * canvas.width / canvas.clientWidth;
        const pixelY = canvas.height - mouseY * canvas.height / canvas.clientHeight - 1;
        const data = new Uint8Array(4);
        gl.readPixels(
            pixelX,                 // x
            pixelY,                 // y
            1,                 // width
            1,                 // height
            gl.RGBA,           // format
            gl.UNSIGNED_BYTE,  // type
            data);             // typed array to hold result

        const id = data[0] + (data[1] << 8) + (data[2] << 16) + (data[3] << 24);
        
        
        
        // select a obj when nothing is selected
        if(selectedObjeId === -1 && id > squarePlaneCount ){
            
            let newSelection = selectableObjArray[id-1];
            
            newSelection.selected = true;
            selectedObjeId = id;
            
            // if the selected object is car then open div
            if(newSelection instanceof Car && !newSelection.hasJob){
                openToggleCar();
            }
        }
        
        // select an obj when something is already selected 
        else if(selectedObjeId !== -1 && id > squarePlaneCount){
            
            let selectedObj = selectableObjArray[selectedObjeId-1];
            let newSelection = selectableObjArray[id-1];
            
            if(newSelection instanceof Car){
                openToggleCar();
            }
            
            // if selected obj and new selecting has same type
            if(selectedObj.name === newSelection.name){
                
                // remove selection if the user select same obj
                if(id === selectedObjeId){
                    selectedObj.selected = false;
                    selectedObjeId = -1;
                    
                    if(selectedObj instanceof Car){
                        closeToggleCar();
                    }
                    
                }else{
                    // change the selection if the user select different obj same name
                    selectedObj.selected = false;
                    newSelection.selected = true;
                    selectedObjeId = id;
                }
            }else if(selectedObj instanceof Car && newSelection instanceof Building){
                
                // new selection is building remove car div
                closeToggleCar();
                    
                // go to the building
                // if the car has already a job skip the selection
                if(!selectedObj.hasJob){
                        
                    // get position of the square plane
                    const pos = newSelection.position;

                    // find nearest node and assign to the destionation of the car
                    const nearestNode = findNearstNode(pos);
                    
                    // destinationNode !== nearstNode go to the location 
                    if((selectedObj.currentNode.position[0] !== nearestNode.position[0]) ||
                            (selectedObj.currentNode.position[1] !== nearestNode.position[1])){
                        
                        selectedObj.destinationNode = nearestNode;
                        selectedObj.hasJob = true;
                        // car has a job we dont have any selected object anymore
                        // therefore assign -1 to the selectedObjId
                        selectedObjeId = -1;
                    }
                    // destinationNode === nearstNode skip the hasJob
                    else{
                        selectedObjeId = -1;
                        selectedObj.selected = false;
                    }
                }
            }else if(selectedObj instanceof Building && newSelection instanceof Car){
                
                // new selection is a car open the div
                openToggleCar();
                
                // change the selection if the user select different obj
                selectedObj.selected = false;
                newSelection.selected = true;
                selectedObjeId = id;
            }
        }
        
        // select an empty space when something is selected
        else if(id>0 && id <= squarePlaneCount && selectedObjeId !== -1){
            
            let selectedObj = selectableObjArray[selectedObjeId-1];
            let newSelection = selectableObjArray[id-1];
            
            // if selected is a car then move the car
            if(selectedObj instanceof Car){
                
                // when the car is moving remove the div
                closeToggleCar();
                
                // go to the location
                // if the car has already a job skip the selection
                if(!selectedObj.hasJob){
                        
                    // get position of the square plane
                    const pos = newSelection.position;
                    
                    // clear the body class list to remove cursor image
                    var classList = body.classList;
                    while (classList.length > 0) {
                        classList.remove(classList.item(0));
                    }
                    
                    // build cargo is clicked
                    if(buildCargoClicked){
                        selectedObj.onClickPos = pos;
                        buildCargoClicked = false;
                    }else{
                        selectedObj.onClickPos = -1;
                    }
                    
                    // find nearest node and assign to the destionation of the car
                    const nearestNode = findNearstNode(pos);
                    
                    selectedObj.destinationNode = nearestNode;
                    selectedObj.hasJob = true;

                    // car has a job we dont have any selected object anymore
                    // therefore assign -1 to the selectedObjId
                    selectedObjeId = -1;

                }// hasjob
            }// moving car end
            
            // if selected is a building then remove selection
            if(selectedObj instanceof Building){
                selectedObj.selected = false;
                selectedObjeId = -1;
            }
            
        }
        
        // focus the selected obj
        if(id > squarePlaneCount){
            focusSelectedObject();
        }
        
        // if the user select an object and the object is a building 
        if(id > 0 && selectedObjeId !== -1 && selectableObjArray[selectedObjeId-1] instanceof Building){
            openBuildingMenu();
        }else{
            closeBuildingMenu();
        }   
        
        // clear the frame buffer
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        gl.viewport( 0, 0, canvas.width, canvas.height );
      
    });

}


