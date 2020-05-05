var id = 0;
var arestas;

function Nodo(indice){
    id = indice;
    arestas = [];
}

Nodo.prototype.addAresta = function(idV, p){
    arestas.push({idVizinho:idV, peso:p});
}

Nodo.prototype.getArestas = function(){
    if(arestas.length > 1){
        return arestas;
    }
    else{
        return null;
    }
}