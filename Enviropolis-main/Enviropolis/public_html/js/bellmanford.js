
function bellmanFord( graph , sourceNode){
    
    var distances = [];
    var parents = [];
    
    if(!sourceNode){
        return parents;
    }
    
    for (let id of graph.nodes.keys()) {
        distances[id] = 10000;
    }
    distances[sourceNode.id] = 0;
    
    
    // u => soruce v => destination
    for (var i = 0 ; i < graph.nodes.size; i++) {
        
        graph.edges.forEach(edge => {
            
            if(distances[edge.sourceId] + edge.weight <  distances[edge.destinationId]){
                distances[edge.destinationId] = distances[edge.sourceId] + edge.weight;
                parents[edge.destinationId] = edge.sourceId;
            }
        });
    }
    
    return parents;
    
}