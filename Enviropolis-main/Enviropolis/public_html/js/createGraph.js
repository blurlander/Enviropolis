
// global graph to acces other scripts
const graph = new Graph();

function createGraphByNodeFile(text){
    var lines = text.split("\n");

    // every word in one single line
    var word;
    
    const vectorArray = [];
    const idArray = [];
    // id of the nodes
    let id = 0;
    for (var i = 0 ; i < lines.length; i++) {
        word = lines[i].split(" ");
        /* word[1] = x 
         * word[2] = y
         * word[3} = z
         */
        
        if(word[0] === 'v'){
            let x = parseFloat(word[1]);
            let y = parseFloat(word[3]);
            
            let sameId = false;
            
            // if the same position vector comes then use same id or dont change id 
            for (let j = 0; j < vectorArray.length; j++) {
                if(vectorArray[j][0].toFixed(2) === x.toFixed(2) && vectorArray[j][1].toFixed(2) === y.toFixed(2)){
                    idArray.push(idArray[j]); 
                    sameId = true;
                    break;
                }
            }
            
            if(!sameId){
                idArray.push(id);
                id++;
            }
            
            vectorArray.push(vec2(x, y));
            
        } 
    }// for
    
    for (var i = 0; i < vectorArray.length; i=i+2) {
        graph.addEdge(idArray[i],vectorArray[i], idArray[i+1],vectorArray[i+1]);
    }
    
}// function

