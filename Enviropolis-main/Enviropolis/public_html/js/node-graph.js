

class Node {
    constructor(id,position){
        this.id = id;
        this.position = position;
        this.adjacents = [];
    }
    
    addAdjacent(node) {
        this.adjacents.push(node);
    }
    
    isAdjacent(node) {
        return this.adjacents.indexOf(node) > -1;
    }
  
}

class Edge {
    constructor(sourceId,destinationId, weight){
        this.sourceId = sourceId;
        this.destinationId = destinationId;
        this.weight = weight;
    }
}


class Graph{
    constructor(){  
        /* all vertices in here nodes map
         * 
        nodes Map
        1-> [ id:1 , node1 ]
        2-> [ id:2 , node2 ]
        ...
        
        */
        this.nodes = new Map();
        this.edges = [];
    }
    
    
    addEdge(sourceId,sourcePosition, destinationId,destinationPosition) {
        
        // create or get source and destination
        const sourceNode = this.addVertex(sourceId,sourcePosition);
        const destinationNode = this.addVertex(destinationId,destinationPosition);
        
        // fill the adjacent array
        sourceNode.addAdjacent(destinationNode);
        // silinebilir
        destinationNode.addAdjacent(sourceNode);
        
        // weight vector = vec2(x,y)
        // weight of edge = square root of (x^2 + y^2)
        const weightVector = subtract( sourceNode.position, destinationNode.position);
        const weight = Math.sqrt(weightVector[0]*weightVector[0] + weightVector[1]* weightVector[1]);
        
        let edge = new Edge(sourceNode.id, destinationNode.id, weight);
        let edge2 = new Edge(destinationNode.id,sourceNode.id,weight);
        this.edges.push(edge,edge2);
    }


    addVertex(id,position) {
        // if already has an same position skip
        if(this.nodes.has(id)) {
            return this.nodes.get(id);
        } else {
            const vertex = new Node(id,position);
            this.nodes.set(id, vertex);
            return vertex;
        }
    }
    
}

function findNearstNode(position){
    let index=0;
    let diffX = position[0] - graph.nodes.get(0).position[0];
    let diffY = position[2] - graph.nodes.get(0).position[1];
    let distance = (diffX*diffX) + (diffY*diffY);
    let min = distance;
    
    for (var i = 1; i < graph.nodes.size; i++) {
        
        diffX = position[0] - graph.nodes.get(i).position[0];
        diffY = position[2] - graph.nodes.get(i).position[1];
        distance = (diffX*diffX) + (diffY*diffY);
        
        if( distance < min){
            min = distance;
            index = i;
            /*
            if(distance < 100){
                break;
            }
             * 
             */
        }

    }
    return graph.nodes.get(index);
}