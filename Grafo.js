var nodos;
//var aresta = {idVizinho:0, peso:0};

function Grafo(){
    nodos = [];
}

Grafo.prototype.Nodo = function(indice){
    this.id = indice;
    this.visitado = false;
    this.arestas = [];
}

Grafo.prototype.AddNodo = function(id){
    //nodos = [{id:0, arestas:[]}];
    var n = new this.Nodo(id);
    nodos.push(n);
}

Grafo.prototype.AddArestaOnNodo = function(id, idVi, p){
    nodos[id].arestas.push({idVizinho:idVi, peso:p});
}

Grafo.prototype.getNodos = function(){

    return nodos;
}

Grafo.prototype.ResetVisitados = function(){
    for(var i = 0; i< nodos.length;i++){
        nodos[i].visitado = false;
    }
}

/*Grafo.prototype.getNdeVizinhos = function(indice){
    return nodos[indice].arestas.lenght;
}*/