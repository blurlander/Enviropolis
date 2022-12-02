
// get all dom element from HTML
const loader_div = document.querySelector(".loader");
const scrollPaperDiv = document.getElementById("scroll-paper");
const toggleCarDiv = document.getElementsByClassName("toggle-car")[0];
const carMenuDiv = document.getElementsByClassName("car-menu")[0];
const treeMenuDiv = document.getElementsByClassName("tree-menu")[0];
const toggleTreeDiv = document.getElementsByClassName("toggle-tree")[0];
const buyCarDiv = document.getElementsByClassName("buy-car")[0];
const windmillDiv = document.getElementsByClassName("windmill")[0];
const tree1Div = document.getElementsByClassName("tree1")[0];
const tree2Div = document.getElementsByClassName("tree2")[0];
const tree3Div = document.getElementsByClassName("tree3")[0];
const storeMenuDiv = document.getElementsByClassName("store-menu")[0];
const sellCargoSpan = document.getElementById("sellCargo");
const buildCargoSpan = document.getElementById("buildCargo");
const body = document.body;
const toggleSolarPanel = document.getElementsByClassName("toggle-solar-panel")[0];
const solarPanelMenu = document.getElementsByClassName("solar-panel-menu")[0];
const solarPanel1Div = document.getElementsByClassName("solar-panel1")[0];
const solarPanel2Div = document.getElementsByClassName("solar-panel2")[0];
const moneySpan = document.getElementById("money");
const carPriceSpan = document.getElementById("car-price-id");
const airBarDiv = document.getElementById("airBar");
const energyBarDiv = document.getElementById("energyBar");

const sliderList = document.getElementsByClassName("slider");
const rotateYSpan = document.getElementById("rotateY-span");
const rotateXSpan = document.getElementById("rotateX-span");
const rotateZSpan = document.getElementById("rotateZ-span");
const translateZSpan = document.getElementById("translateZ-span");
const translateXSpan = document.getElementById("translateX-span");
const translateYSpan = document.getElementById("translateY-span");
const buildingMenuContainerDiv = document.getElementsByClassName("building-menu-container")[0];

const sliderLightList = document.getElementsByClassName("slider-light");
const rotateYLightSpan = document.getElementById("rotateY-span-light");
const rotateXLightSpan = document.getElementById("rotateX-span-light");
const rotateZLightSpan = document.getElementById("rotateZ-span-light");
const translateZLightSpan = document.getElementById("translateZ-span-light");
const translateXLightSpan = document.getElementById("translateX-span-light");
const translateYLightSpan = document.getElementById("translateY-span-light");
const lightIntensitySpan = document.getElementById("span-light-intensity");
const lightAngleSpan = document.getElementById("span-light-angle");
const buildingMenuContainerLightDiv = document.getElementsByClassName("building-menu-container-light")[0];

let count = 0;

let rotateXValue = 0;
let rotateYValue = 0;
let rotateZValue = 0;
let translateXValue = 0;
let translateYValue = 0;
let translateZValue = 0;

let isFast = false;

let rotateXLightValue=0,rotateYLightValue=0,rotateZLightValue=0,
        translateXLightValue=0,translateYLightValue=0,translateZLightValue = 0;

// call it from main function
function interface(){
    
    // after 3 second close the loader giff
    setTimeout(() =>{
        loader_div.classList.add("disappear");
    },3500);
    
    setTimeout(()=>{
        loader_div.classList.add("hidden");
    },10000);
    
    
    document.addEventListener('keydown', (event)=>{
        
        // open and colse scroll paper with escape character
        if(event.key === 'Escape'){
            if(scrollPaperDiv.classList.contains('hidden')){
                scrollPaperDiv.classList.remove('hidden');
            }else{
                scrollPaperDiv.classList.add('hidden');
            }
            
            renderFlag = !renderFlag;
            render();
        }
        
        if(event.key === "2"){
            if(isFast){
                deltaTime -= deltaTime/2;
                isFast = !isFast;
            }else{
                deltaTime += deltaTime;
                isFast = !isFast;
            }
        }
        
    });

    
    // open and close car menu
    toggleCarDiv.addEventListener('click', () =>{
        
        if(carMenuDiv.classList.contains("hidden")){
            // open the menu
            openCarMenu();
        }else{
            // close everything
            closeCarMenu();
            closeTreeMenu();
            closeSolarMenu();
        }
        
    });
    
    // open and close tree menu
    toggleTreeDiv.addEventListener('click', ()=>{
        if(treeMenuDiv.classList.contains("hidden")){
            openTreeMenu();
        }else{
            closeTreeMenu();
        }
        
    });
    
    // open and close solar panel menu
    toggleSolarPanel.addEventListener('click', ()=>{
        if(solarPanelMenu.classList.contains("hidden")){
            openSolarMenu();
        }else{
            closeSolarMenu();
        }
    });
    
    
    // **************** BUYING *******************
    buyCarDiv.addEventListener('click', ()=>{
        
        if(totalMoney > carCount*carPrice){
            buyACar();
            focusSelectedObject(1);
            totalMoney -= carCount*carPrice;
            moneySpan.textContent = totalMoney.toFixed(2);
        }
        
        
    });
    
    windmillDiv.addEventListener('click',()=>{
        
        if(totalMoney > windmillPrice){
            goToBaseNodeToLoadingCargo("windmill");
            totalMoney -= windmillPrice;
            moneySpan.textContent = totalMoney.toFixed(2);
        }
        
    });
    
    solarPanel1Div.addEventListener('click',()=>{
        
        if(totalMoney > solar1Price){
            goToBaseNodeToLoadingCargo("solarPanel1");
            totalMoney -= solar1Price;
            moneySpan.textContent = totalMoney.toFixed(2);
        }
        
    });
    
    solarPanel2Div.addEventListener('click',()=>{
        
        if(totalMoney > solar2Price){
            goToBaseNodeToLoadingCargo("solarPanel2");
            totalMoney -= solar2Price;
            moneySpan.textContent = totalMoney.toFixed(2);
        }
        
    });
    
    tree1Div.addEventListener('click',()=>{
        
        if(totalMoney > tree1Price){
            goToBaseNodeToLoadingCargo("tree1");
            totalMoney -= tree1Price;
            moneySpan.textContent = totalMoney.toFixed(2);
        }
        
    });
    
    tree2Div.addEventListener('click',()=>{
        
        if(totalMoney > tree2Price){
            goToBaseNodeToLoadingCargo("tree2");
            totalMoney -= tree2Price;
            moneySpan.textContent = totalMoney.toFixed(2);
        }
    });
    
    tree3Div.addEventListener('click',()=>{
        if(totalMoney > tree3Price){
            goToBaseNodeToLoadingCargo("tree3");
            totalMoney -= tree3Price;
            moneySpan.textContent = totalMoney.toFixed(2);
        }
    });
    
    

    for (var i = 0; i < sliderList.length; i++) { 
       sliderList[i].oninput = function (){
            
            let building = selectableObjArray[selectedObjeId-1];
            
            switch (this.id) {
                case "rotateX-slider":
                    rotateXSpan.innerHTML = this.value;
                    rotateXValue = parseInt(this.value);
                    break;
                case "rotateY-slider":
                    rotateYSpan.innerHTML = this.value;
                    rotateYValue = parseInt(this.value);
                    break;
                case "rotateZ-slider":
                    rotateZSpan.innerHTML = this.value;
                    rotateZValue = parseInt(this.value);
                    break;
                
                case "translateY-slider":
                    translateYSpan.innerHTML = this.value;
                    translateYValue = parseInt(this.value);
                    break;
                case "translateX-slider":
                    translateXSpan.innerHTML = this.value;
                    translateXValue = parseInt(this.value);
                    break;
                case "translateZ-slider":
                    translateZSpan.innerHTML = this.value;
                    translateZValue = parseInt(this.value);
                    break;
                
                default:
                    
                    break;
            }
            
            building.transform(rotateXValue,rotateYValue,rotateZValue,translateXValue,translateYValue,translateZValue);
            
       };
    }
    
    for (var i = 0; i < sliderLightList.length; i++) { 
       sliderLightList[i].oninput = function (){
            
            switch (this.id) {
                case "rotateX-slider-light":
                    rotateXLightSpan.innerHTML = this.value;
                    rotateXLightValue = parseInt(this.value);
                    break;
                case "rotateY-slider-light":
                    rotateYLightSpan.innerHTML = this.value;
                    rotateYLightValue = parseInt(this.value);
                    break;
                case "rotateZ-slider-light":
                    rotateZLightSpan.innerHTML = this.value;
                    rotateZLightValue = parseInt(this.value);
                    break;
                case "translateY-slider-light":
                    translateYLightSpan.innerHTML = this.value;
                    translateYLightValue = parseInt(this.value);
                    break;
                case "translateX-slider-light":
                    translateXLightSpan.innerHTML = this.value;
                    translateXLightValue = parseInt(this.value);
                    break;
                case "translateZ-slider-light":
                    translateZLightSpan.innerHTML = this.value;
                    translateZLightValue = parseInt(this.value);
                    break;
                case "slider-light-intensity":
                    lightIntensitySpan.innerHTML = this.value;
                    lightIntensity = parseFloat(this.value);
                    break;
                case "slider-light-angle":
                    lightAngleSpan.innerHTML = this.value;
                    angle = Math.cos(radians(parseInt(this.value)));
                    break;
                default:
                    
                    break;
            }
            
            lightTransform(rotateXLightValue,rotateYLightValue,rotateZLightValue,
            translateXLightValue,translateYLightValue,translateZLightValue);
       };
    }    
}

function lightTransform(rotateXLightValue,rotateYLightValue,rotateZLightValue,
        translateXLightValue,translateYLightValue,translateZLightValue){
        
    
    let lmat = lookAt(originalLightPosition,at2,up);
    
    lmat = mult(lmat, translate( translateXLightValue,translateYLightValue,translateZLightValue) );
    
    lmat = mult(lmat,rotateX(rotateXLightValue));
    lmat = mult(lmat,rotateY(rotateYLightValue));
    lmat = mult(lmat,rotateZ(rotateZLightValue));
    
    at2 = [-lmat[2][0], -lmat[2][1],-lmat[2][2]];
    
    /*
    lightPosition = vec3( lightPosition[0],originalLightPosition[1]+translateYLightValue,lightPosition[2]);
    lightPosition = vec3(originalLightPosition[0]+translateXLightValue, lightPosition[1],lightPosition[2]);
    light
    */
    
    lightPosition[0] = originalLightPosition[0] + translateXLightValue;
    lightPosition[1] = originalLightPosition[1] + translateYLightValue;
    lightPosition[2] = originalLightPosition[2] + translateZLightValue;

}


function toggleLight(){
    lightIsOpen = !lightIsOpen;
}

function incAirBar(amount){

    airBarWidth += amount;
    
    if(airBarWidth < 100){
        airBarDiv.style.width = airBarWidth + "%";
        airBarDiv.textContent = airBarWidth + "%";
    }else{
        airBarDiv.style.width = "100%";
        airBarDiv.textContent = "100%";
    }
    
}
function decAirBar(amount){
    
    airBarWidth -= amount;
    
    if(airBarWidth >= 0){
        airBarDiv.style.width = airBarWidth + "%";
        airBarDiv.textContent = airBarWidth + "%";
    }else{
        airBarDiv.style.width = "0%";
        airBarDiv.textContent =  "0%";
    }
    
}

function incEnergyBar(amount){
    
    energyBarWidth += amount;
    
    if(energyBarWidth < 100){
        energyBarDiv.style.width = energyBarWidth + "%";
        energyBarDiv.textContent = energyBarWidth + "%";
    }else{
        energyBarDiv.style.width = "100%";
        energyBarDiv.textContent = "100%";
    }
    
}

function decEnergyBar(amount){
    
    energyBarWidth -= amount;
    
    if(energyBarWidth >= 0){
        energyBarDiv.style.width = energyBarWidth + "%";
        energyBarDiv.textContent = energyBarWidth + "%";
    }else{
        energyBarDiv.style.width = "0%";
        energyBarDiv.textContent = "0%";
    }
    
}


function goToBaseNodeToLoadingCargo(buildObjectName){
    
    let selectedCar = selectableObjArray[selectedObjeId-1];
    
    // if the car is in different node go to the base node
    if((selectedCar.currentNode.position[0] !== baseNode.position[0]) ||
            (selectedCar.currentNode.position[1] !== baseNode.position[1])){
        
        selectedCar.destinationNode = baseNode;
        selectedCar.hasJob = true;
        
        selectedObjeId = -1;
        closeToggleCar();
        
        // get the load
        selectedCar.onClickPos = -1;
        selectedCar.isLoad = true;
        selectedCar.cargo = buildObjectName;
    }
    // if the car is in base node then dont move
    else{
        selectedObjeId = -1;
        selectedCar.selected = false;
        closeToggleCar();
        
        // get the load
        selectedCar.onClickPos = -1;
        selectedCar.isLoad = true;
        selectedCar.cargo = buildObjectName;
    }
}

function openCarMenu(){
    
    let carObj = selectableObjArray[selectedObjeId-1];
    
    if(carMenuDiv.classList.contains("hidden") && !carObj.isLoad ){
        carMenuDiv.classList.remove("hidden");
    }
    
}

function openLightMenu(){
    if(buildingMenuContainerLightDiv.classList.contains("hidden")){
        buildingMenuContainerLightDiv.classList.remove("hidden");
    }else{
        buildingMenuContainerLightDiv.classList.add("hidden");
    }
}

function closeLightMenu(){
    if(!buildingMenuContainerLightDiv.classList.contains("hidden")){
        buildingMenuContainerLightDiv.classList.add("hidden");
    }
}

function closeCarMenu(){
    
    if(!carMenuDiv.classList.contains("hidden")){
        carMenuDiv.classList.add("hidden");
    }
}

function openTreeMenu(){
           
    if(treeMenuDiv.classList.contains("hidden")){
        treeMenuDiv.classList.remove("hidden");
    }
}

function closeTreeMenu(){
    
    if(!treeMenuDiv.classList.contains("hidden")){
        treeMenuDiv.classList.add("hidden");
    }
}

function openSolarMenu(){
           
    if(solarPanelMenu.classList.contains("hidden")){
        solarPanelMenu.classList.remove("hidden");
    }
}

function closeSolarMenu(){
    
    if(!solarPanelMenu.classList.contains("hidden")){
        solarPanelMenu.classList.add("hidden");
    }
}

function openStoreMenu(){
    
    let carObj = selectableObjArray[selectedObjeId-1];
    
    if(storeMenuDiv.classList.contains("hidden") && carObj.isLoad){
        storeMenuDiv.classList.remove("hidden");
    }
}

function closeStoreMenu(){
    
    if(!storeMenuDiv.classList.contains("hidden")){
        storeMenuDiv.classList.add("hidden");
    }
    
}

function openToggleCar(){
    
    toggleCarDiv.classList.remove("hidden");
    
    closeCarMenu();
    closeTreeMenu();
    closeSolarMenu();
    
    openStoreMenu();
    
    let carObj = selectableObjArray[selectedObjeId-1];
    
    sellCargoSpan.textContent = carObj.cargo;
    buildCargoSpan.textContent = carObj.cargo;
    
}

function closeToggleCar(){
    toggleCarDiv.classList.add("hidden");
    closeCarMenu();
    closeTreeMenu();
    closeStoreMenu();
    closeSolarMenu();
}

function resetSliders(){
    
    // 
    rotateXValue = 0;
    rotateYValue = 0;
    rotateZValue = 0;
    translateXValue = 0;
    translateYValue = 0;
    translateZValue = 0;
    
    for (var id = squarePlaneCount + 1; id <= selectableObjArray.length ; id++) {
        
        let obj = selectableObjArray[id-1];
        
        if(obj instanceof Building && (obj.angleX !== 0 || obj.angleZ !== 0 || obj.angleY !== 0 ||
                                           obj.translateX !== 0 || obj.translateY !== 0 ||  obj.translateZ !== 0 )){
            
            obj.matrix = mult(obj.matrix, rotateZ(-obj.angleZ));
            obj.matrix = mult(obj.matrix, rotateY(-obj.angleY));
            obj.matrix = mult(obj.matrix , rotateX(-obj.angleX));
            
            obj.matrix = mult(obj.matrix , translate(0,-obj.translateY,0));
            
            obj.matrix = mult(obj.matrix, rotateY(obj.angleY));
            
            obj.originalMatrix = mult(mat4(),obj.matrix);
    
            obj.angle += obj.angleY;
        
            obj.angleX = 0;
            obj.angleZ =0;
            obj.angleY =0 ;
            obj.translateX = 0;
            obj.translateY = 0;
            obj.translateZ = 0;
            
            let pos = obj.getPosition(); 
            obj.position = vec3(pos[0],0,pos[1] );
        }
        
    }

    for (var i = 0; i < sliderList.length; i++) {
        
        sliderList[i].value = 0;

        switch (sliderList[i].id) {
            case "rotateX-slider":
                rotateXSpan.innerHTML = 0;
                break;
            case "rotateY-slider":
                rotateYSpan.innerHTML = 0;
                break;
            case "rotateZ-slider":
                rotateZSpan.innerHTML = 0;
                break;

            case "translateY-slider":
                translateYSpan.innerHTML = 0;
                break;
            case "translateX-slider":
                translateXSpan.innerHTML = 0;
                break;
            case "translateZ-slider":
                translateZSpan.innerHTML = 0;
                break;

            default:

                break;
        }
    }
}

function openBuildingMenu(){
    
    if(buildingMenuContainerDiv.classList.contains("hidden")){
        buildingMenuContainerDiv.classList.remove("hidden"); 
    }
    resetSliders();
    closeLightMenu();
}


function closeBuildingMenu(){
    if(!buildingMenuContainerDiv.classList.contains("hidden")){
        buildingMenuContainerDiv.classList.add("hidden");
    }
    resetSliders();

}

function sellCargo(){
    
    let carObj = selectableObjArray[selectedObjeId-1];
    
    switch (carObj.cargo) {
        case "tree1":
            totalMoney += (tree1Price / 1.5 );
            moneySpan.textContent = totalMoney.toFixed(2);
            break;
        case "tree2":
            totalMoney += (tree2Price / 1.5 );
            moneySpan.textContent = totalMoney.toFixed(2);
            break;
        case "tree3":
            totalMoney += (tree3Price / 1.5 );
            moneySpan.textContent = totalMoney.toFixed(2);
            break;
        case "windmill":
            totalMoney += (windmillPrice / 1.25 );
            moneySpan.textContent = totalMoney.toFixed(2);
            break;
        case "solarPanel1":
            totalMoney += (solar1Price / 1.25 );
            moneySpan.textContent = totalMoney.toFixed(2);
            break;
        case "solarPanel2":
            totalMoney += (solar2Price / 1.25 );
            moneySpan.textContent = totalMoney.toFixed(2);
            break;
        default:
            
            break;
    }
    
    carObj.isLoad = false;
    carObj.cargo = "";
    
    closeToggleCar();
    openToggleCar();
    
}

let buildCargoClicked = false;
function buildCargo(){
    buildCargoClicked = true;
    
    let carObj = selectableObjArray[selectedObjeId-1];
    
    switch (carObj.cargo) {
        case "tree1":
            body.classList.add("tree1-cursor");
            break;
        case "tree2":
            body.classList.add("tree2-cursor");
            break;
        case "tree3":
            body.classList.add("tree3-cursor");
            break;
        case "windmill":
            body.classList.add("windmill-cursor");
            break;
        case "solarPanel1":
            body.classList.add("solar-panel1-cursor");
            break;
        case "solarPanel2":
            body.classList.add("solar-panel2-cursor");
            break;    
        default:
            
            break;
    }
    
    closeStoreMenu();
}

function GoToFreeCar(){
    
    closeBuildingMenu();
    
    for (var id = squarePlaneCount +1; id <= selectableObjArray.length; id++) {

        let carObj = selectableObjArray[id-1];
        
        if(carObj instanceof Building){
            carObj.selected = false;
        }
        
        // if the car is not moving and not recenly focused
        if(carObj instanceof Car && !carObj.isMoving){

            if(count === 0){
                for (var i = squarePlaneCount +1 ; i<= selectableObjArray.length; i++) {
                    
                    let obj = selectableObjArray[i-1];
                    
                    if(obj instanceof Car){
                        obj.recentlyFocus = false;
                        obj.selected = false; 
                    }
                }
                
            }

            // if the car is recently visited then skip the car
            if(carObj.recentlyFocus){
                carObj.selected = false;
                selectedObjeId = -1;
                closeToggleCar();
                continue;
            }
            
            // select the car when nothing is selected
            if(selectedObjeId === -1){
                count++;
                
                carObj.selected = true;
                carObj.recentlyFocus = true;
                selectedObjeId = id;
                
                // open div
                openToggleCar();
                
                // focus the selected obj
                focusSelectedObject();

                // everthing is chosen once then reset all 
                if(count === carCount){
                    count = 0;
                    for (var i = squarePlaneCount +1 ; i<= selectableObjArray.length; i++) {
                        let obj = selectableObjArray[i-1];
                        if(obj instanceof Car){
                            obj.recentlyFocus = false;
                        }
                    }
                }
                return;
            }
            
            // select the car when something is already selected 
            else if (selectedObjeId !== -1){
                count++;
                let selectedObj = selectableObjArray[id-1];
                
                selectedObj.selected = false;
                
                carObj.recentlyFocus = true;
                carObj.selected = true;
                selectedObjeId = id;
                
                // open div
                openToggleCar();
                
                // focus the new selected car
                focusSelectedObject();

                // everthing is chosen once then 
                if(count === carCount){
                    count = 0;
                    for (var i = squarePlaneCount +1 ; i<= selectableObjArray.length; i++) {
                        let obj = selectableObjArray[i-1];
                        if(obj instanceof Car){
                            obj.recentlyFocus = false;
                        }
                    }
                }
                
                return;
            }
            
        }// find free car and focus end
        
        
        //  lightPosition = vec3( lightPosition[0],originalLightPosition[1]+parseInt(this.value),lightPosition[2]);
        
    }// for
    
}
