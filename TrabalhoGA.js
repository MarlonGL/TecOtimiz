var canvas;
var ctx;
var pontos = [];
var pontosA = [];
var pSize = 5;
var hull = [];
var width;
var height;
var canvasLeft, canvasTop;

var clicavel = true;

var graham = false;
var voronoiBool = false;
var grafoB = false;
var astarb = false;

var voronoi = new Voronoi();
var sites = [];
var edges = [];
var cells = [];

var grafo = new Grafo();
var nodos = [];

var caminho = [];
var pontoStart, pontoEnd;
var clickponto = 0;
var astarSelection = false;

var botaoPD = document.getElementById("Bpd");
var botaoBmc = document.getElementById("Bmc");
var botaoBc = document.getElementById("Bc");
var botaoBgs = document.getElementById("Bgs");
var botaoBvo = document.getElementById("Bvo");
var botaoBgr = document.getElementById("Bgr");
var botaoBRas = document.getElementById("bras");
var botaoPa = document.getElementById("Bpa");

function ccw(p1, p2, p3) {
    // ccw > 0: counter-clockwise; ccw < 0: clockwise; ccw = 0: collinear
   return (p2.x - p1.x) * (p3.y - p1.y)
    - (p2.y - p1.y) * (p3.x - p1.x);
} 

function polarAngle(p) {
    return Math.atan(p.y / p.x);
}
function angle(o, a) {
    return Math.atan((a.y-o.y) / (a.x - o.x));
}
function dotProduct(vec1, vec2) {
    return (vec1.x * vec2.x + vec1.y * vec2.y);
}
function norm(vec) {
    return Math.sqrt(vec.x * vec.x + vec.y * vec.y);
}
function computeAngle(v1, v2) {
    var ac = dotProduct(v1, v2);
    return Math.acos(ac / (norm(v1) * norm(v2))) * ONE_RADIAN;
}
function dist(p1, p2){
    return Math.sqrt((p1.x - p2.x)*(p1.x - p2.x) + (p1.y - p2.y)*(p1.y - p2.y));
}

function interseccao(mouse, ponto){
    return Math.sqrt((mouse.x-ponto.x) ** 2 + (mouse.y - ponto.y) ** 2) < pSize;
}

canvas = document.getElementById('GrahamCanvas');
canvasLeft = canvas.offsetLeft + canvas.clientLeft;
canvasTop = canvas.offsetTop + canvas.clientTop;


ctx = canvas.getContext("2d");
width = canvas.width;
height = canvas.height;
ctx.translate(width / 2, height / 2);

function CleanCanvas() {
    ctx.clearRect(-width/2, -height/2, width, height);
    ctx.fillStyle = "black";
    ctx.fillRect(-width/2, -height/2, width, height);
}

CleanCanvas();

pontos = [];

Resetar();

canvas.addEventListener('click', (e) => {
    //console.log(clicavel);
    var xx = e.pageX - canvasLeft;
    var yy = e.pageY - canvasTop;
    xx -= 250;
    yy -= 250;
    if (clicavel) {
        pontos.push({ x: xx, y: yy, a: 0 });
        ctx.fillStyle = "lime";
        ctx.strokeStyle = "lime";
        ctx.beginPath();
        ctx.arc(xx, yy, pSize, 0, 2 * Math.PI);
        ctx.fill();
        ctx.stroke();
        //DrawPontos();
    }
    else if(astarSelection){
        var pontoMouse = { x: xx, y: yy };
        for (var i = 0; i < sites.length; i++) {
            if (interseccao(pontoMouse, sites[i])) {
                //console.log("clicou " + pontos[i]);
                if(clickponto == 0){
                    pontoStart = sites[i].voronoiId;
                    ctx.fillStyle = "blue";
                    ctx.strokeStyle = "#05eaff";
                    ctx.beginPath();
                    ctx.arc(sites[pontoStart].x, sites[pontoStart].y, pSize * 2, 0, 2 * Math.PI);
                    ctx.lineWidth = 4;
                    ctx.fill();
                    ctx.stroke();
                    console.log("ponto start: "+ pontoStart);
                    clickponto++;
                }else if(clickponto == 1){
                    pontoEnd = sites[i].voronoiId;
                    console.log("ponto end: "+pontoEnd);
                    astarSelection = false;
                    botaoBmc.style.visibility = "visible";
                    astarb = true;
                    Astar(pontoStart, pontoEnd);
                    botaoBRas.style.visibility = "visible";
                }
            }
        }
    }
});

function Resize() {
    canvasLeft = canvas.offsetLeft + canvas.clientLeft;
    canvasTop = canvas.offsetTop + canvas.clientTop;
    //console.log("res");
}
function PontosDefinidos() {
    botaoPD.style.visibility = "hidden";
    botaoPa.style.visibility = "hidden";
    CleanCanvas();
    pontos = [];
    clicavel = false;
    pontos = [{ x: -13, y: 0.5, a: 0 }, { x: -10.5, y: -11.5, a: 0 },
    { x: -10, y: 9, a: 0 }, { x: -4.5, y: -2, a: 0 }, { x: -1, y: 8.5, a: 0 },
    { x: 0.5, y: 6, a: 0 }, { x: 0.5, y: -12, a: 0 }, { x: 2, y: 12.5, a: 0 },
    { x: 3.5, y: 11, a: 0 }, { x: 5.5, y: 3, a: 0 }, { x: 5.5, y: -7, a: 0 },
    { x: 5, y: 11.5, a: 0 }, { x: 6.5, y: 3.2, a: 0 }, { x: 7, y: -10, a: 0 },
    { x: 9, y: -5, a: 0 }, { x: 11.5, y: -4, a: 0 }];

    /*pontos = [{x:202 ,y:375 , a:0},{x:192 ,y:380 , a:0},{x:389 ,y:120 , a:0}
    ,{x:475 ,y:469 , a:0},{x:760 ,y:151 , a:0},{x:33 ,y:485 , a:0},
    {x:302 ,y:479 , a:0},{x:331 ,y:92 , a:0},{x:729 ,y:434 , a:0},{x:633 ,y:391 , a:0}, {x:764 ,y:570 , a:0}];
*/
    //pontos Brunao
    /*pontos = [{x: -10, y: -11, a:0},{x: 10, y: -8, a:0},
    {x: 14, y: -5, a:0}, {x: 12, y: -2, a: 0},
    {x: 14, y: 4, a: 0}, {x: 12, y: 8, a: 0},
    {x: 8, y: 14, a: 0}, {x: -3, y: 5, a:0},
    {x: -2, y: 11, a: 0}, {x: -7, y: 12, a: 0},
    {x: -9, y: 2, a:0}, {x: -14, y: 8, a: 0}];*/
    
    for (var i = 0; i < pontos.length; i++) {
        pontos[i].x = pontos[i].x * 15;
        pontos[i].y = pontos[i].y * 15;
    }
    DrawPontos();
}

function PontosAleatorios(){
    botaoPD.style.visibility = "hidden";
    botaoPa.style.visibility = "hidden";
    CleanCanvas();
    pontos = [];
    clicavel = false;

    var tam = Math.floor((Math.random()* 15) + 15);
    var w = width - 50;
    var h = height - 50;
    //var tam = 8;
    for (var i = 0; i < tam; i++) {
        var xx = Math.round((Math.random() * 30) -15);
        var yy = Math.round((Math.random() * 30) - 15);
        pontos.push({ x: xx, y: yy, a: 0 });
    }
    for (var i = 0; i < pontos.length; i++) {
        pontos[i].x = pontos[i].x * 15;
        pontos[i].y = pontos[i].y * 15;
    }
    DrawPontos();
}
//esses pontos abaixo dao erro para: Marlon do futuro
/*pontos = [ {x:-0, y:-14, a:0}, {x:-10.5, y:-14, a:0},
    {x:-10, y:9, a:0}, {x:-4.5, y:-14, a:0}, {x:-1, y:8.5, a:0},
    {x:0.5, y:6, a:0}, {x:0.5, y:-10, a:0}, {x:2, y:12.5, a:0},
    {x:3.5, y:11, a:0}, {x:5.5, y:3, a:0}, {x:5.5, y:-7, a:0},
    {x:5, y:11.5, a:0}, {x:6.5, y:3.2, a:0}, {x:7, y:-10, a:0},
    {x:9, y:-5, a:0}, {x:11.5, y:-4, a:0} ];*/
/*pontos = [ {x:0, y:-12, a:0}, {x:-10.5, y:-14, a:0},
    {x:-10, y:9, a:0}, {x:-4.5, y:-13, a:0}, {x:-1, y:8.5, a:0},
    {x:0.5, y:6, a:0}, {x:0.5, y:-10, a:0}, {x:2, y:12.5, a:0},
    {x:3.5, y:11, a:0}, {x:5.5, y:3, a:0}, {x:5.5, y:-7, a:0},
    {x:5, y:11.5, a:0}, {x:6.5, y:3.2, a:0}, {x:7, y:-10, a:0},
    {x:9, y:-5, a:0}, {x:11.5, y:-4, a:0} ];*/

function DrawPontos() {
    //console.log(pontos);
    ctx.fillStyle = "lime";
    ctx.strokeStyle = "lime";
    for (var i = 0; i < pontos.length; i++) {
        ctx.beginPath();
        //ctx.fillRect(pontos[i].x, pontos[i].y, pSize, pSize);
        ctx.arc(pontos[i].x, pontos[i].y, pSize, 0, 2 * Math.PI);
        ctx.lineWidth = 1;
        ctx.fill();
        ctx.stroke();
    }
}

function Start(){
    if (pontos.length > 5) {
        clicavel = false;
        console.log(pontos);
        GrahamScan();
        CalcularVoronoi();
        //DrawGrafo();
        botaoPD.style.visibility = "hidden";
        botaoPa.style.visibility = "hidden";
        botaoBc.style.visibility = "hidden";
        botaoBgs.style.visibility = "visible";
        botaoBvo.style.visibility = "visible";
        botaoBgr.style.visibility = "visible";
        
        //BotaoGrafo();
        //Astar(4,5);
        astarSelection = true;
        //alert(clicavel);
    }
    else{
        alert("poucos pontos");
    }
}

function Resetar(){
    CleanCanvas();
   
    pontos = [];

    hull = [];

    edges = [];
    caminho = [];

    voronoi = new Voronoi();
    sites = [];
    edges = [];
    cells = [];

    grafo = new Grafo();
    nodos = [];

    clickponto = 0;
    astarSelection = true;

    botaoPD.style.visibility = "visible";
    botaoPa.style.visibility = "visible";
    botaoBc.style.visibility = "visible";
    botaoBgs.style.visibility = "hidden";
    botaoBvo.style.visibility = "hidden";
    botaoBgr.style.visibility = "hidden";
    botaoBmc.style.visibility = "hidden";
    botaoBRas.style.visibility = "hidden";

    clicavel = true;

    graham = false;
    voronoiBool = false;
    grafoB = false;
    astarb = false;

    ResAstar();

    console.log("resetou");
}

function ReDraw(qual){
    if(qual == "Voronoi"){
        CleanCanvas();
        DrawPontos();
        voronoiBool = false;
        if(graham){
            DrawConvexHull();
        }
        if(grafoB){
            DrawGrafo();
        }
        if(astarb){
            DrawAstar();
        }
    }
    else if(qual == "Graham"){
        CleanCanvas();
        DrawPontos();
        graham = false;
        if(voronoiBool){
            DrawVoronoi();
        }
        if(grafoB){
            DrawGrafo();
        }
        if(astarb){
            DrawAstar();
        }
    }
    else if(qual == "Grafo"){
        CleanCanvas();
        DrawPontos();
        grafoB = false;
        if(graham){
            DrawConvexHull();
        }
        if(voronoiBool){
            DrawVoronoi();
        }
        if(astarb){
            DrawAstar();
        }
    }
    else if("Astar"){
        CleanCanvas();
        DrawPontos();
        //astarb = false;
        if(graham){
            DrawConvexHull();
        }
        if(voronoiBool){
            DrawVoronoi();
        }
        if(grafoB){
            DrawGrafo();
        }
    }
    //ctx.fillStyle = "black";
    //ctx.fillRect(-width/2, -height/2, width, height);


}



function CalcularVoronoi() {
    //voronoiBool = !voronoiBool;
    var bbox = { xl: -width / 2, xr: width / 2, yt: -height / 2, yb: height / 2 };
    sites = [];
    for (var i = 0; i < pontos.length; i++) {
        sites.push({ x: pontos[i].x, y: pontos[i].y });
    }
    var diagram = voronoi.compute(sites, bbox);
    sites.sort(function (a, b) {
        return a.voronoiId - b.voronoiId;
    });
    pontos.sort(function (a, b) {
        return a.voronoiId - b.voronoiId;
    });
    for (var i = 0; i < sites.length; i++) {
        grafo.AddNodo(i);
    }
    edges = diagram.edges;
    var n1, n2;
    var d1, d2;
    for (var i = 0; i < edges.length; i++) {
        var edge = edges[i];
        if (edge.lSite && edge.rSite) {
            n1 = edge.lSite.voronoiId;
            n2 = edge.rSite.voronoiId;
            d1 = dist(sites[n1], sites[n2]);
            d2 = dist(sites[n2], sites[n1]);
            //console.log(n1, n2);
            grafo.AddArestaOnNodo(n1, n2, d1);
            grafo.AddArestaOnNodo(n2, n1, d2);
        }
    }
    //DrawVoronoi();
}

function DrawVoronoi() {
    var v;
    ctx.fillStyle = "white";
    ctx.beginPath();
    for (var i = 0; i < edges.length; i++) {
        var edge = edges[i];
        v = edge.va;
        ctx.moveTo(v.x, v.y);
        v = edge.vb;
        ctx.lineTo(v.x, v.y);
        ctx.strokeStyle = "white";
        ctx.lineWidth = 1;
        ctx.stroke();
    }
}

function CalcularAngulos(origem){
    for(var i = 1;i<pontos.length;i++){
        var np = {x:0, y:0, a:0};
        np.x = pontos[i].x - origem.x;
        np.y = pontos[i].y - origem.y;
        np.a = polarAngle(np);
        if(np.a < 0){
            np.a += Math.PI;
        }
        pontos[i].a = np.a;
    }
}

function BotaoVoronoi(){
    voronoiBool = !voronoiBool;
    if(voronoiBool){
        DrawVoronoi();
    }
    else{
        ReDraw("Voronoi");
    }
}

function BotaoGraham(){
    graham = !graham;
    if(graham){
        DrawConvexHull();
    }
    else{
        ReDraw("Graham");
    }
}

function BotaoGrafo(){
    grafoB = !grafoB;
    if(grafoB){
        DrawGrafo();
    }
    else{
        ReDraw("Grafo");
    }

}

function GrahamScan() {
    //graham = !graham;
    //console.log(graham);

    pontos.sort(function (a, b) {
        return a.y != b.y ? a.y - b.y : a.x - b.x;
    });
    //pontos.shift();
    CalcularAngulos(pontos[0]);

    pontos.sort(function (a, b) {
        return a.a - b.a;
    });
    //console.log(pontos);
    //O ponto com o menor y está no hull(pontos[0]);
    //os dois primeiros pontos pertencem ao hull apos a ordenacao por angulo
    hull.push(pontos[0]);
    hull.push(pontos[1]);

    for (var i = 2; i < pontos.length; i++) {
        var p = hull.pop();
        while (ccw(hull[hull.length - 1], p, pontos[i]) <= 0) {
            p = hull.pop();
        }
        hull.push(p);
        hull.push(pontos[i]);
    }

    hull.push(pontos[0]);
    //console.log(hull);

    //DrawConvexHull();
}

function DrawConvexHull(){
    ctx.fillStyle = "yellow";
    ctx.beginPath();
    for(var i=0;i<hull.length - 1;i++){
        ctx.moveTo(hull[i].x, hull[i].y);
        ctx.lineTo(hull[i + 1].x, hull[i + 1].y);
        ctx.strokeStyle = "yellow";
        ctx.lineWidth = 2;
        ctx.stroke();
    }
    ctx.fillStyle = "lime";
    ctx.strokeStyle = "yellow";
    for(var i=0;i<hull.length;i++){
        ctx.beginPath();
        ctx.arc(hull[i].x, hull[i].y, pSize * 1.4, 0, 2 * Math.PI);
        ctx.fill();
        ctx.stroke();
    }
}

function DrawGrafo(){
    var gNodos = [];
    gNodos = grafo.getNodos();
    //console.log(gNodos);
    for(var i = 0; i<gNodos.length; i++){
       // var i = 1;
        ctx.fillStyle = "red";
        ctx.beginPath();
        for(var j = 0; j<gNodos[i].arestas.length; j++){
            ctx.moveTo(sites[gNodos[i].id].x, sites[gNodos[i].id].y);
            ctx.lineTo(sites[gNodos[i].arestas[j].idVizinho].x, sites[gNodos[i].arestas[j].idVizinho].y);
            ctx.strokeStyle = "red";
            ctx.lineWidth = 1;
            ctx.stroke();
        }
    }
    for(var i = 0; i<gNodos.length; i++){
        ctx.fillStyle = "lime";
        ctx.strokeStyle = "white";
        //ctx.fillRect(sites[gNodos[i].id].x, sites[gNodos[i].id].y, pSize, pSize);
        ctx.beginPath();
        //ctx.fillRect(pontos[i].x, pontos[i].y, pSize, pSize);
        ctx.arc(sites[gNodos[i].id].x, sites[gNodos[i].id].y, pSize, 0, 2 * Math.PI);
        ctx.fill();
        ctx.stroke();
    }
}

function CalcularAstar() {
    astarb = !astarb;
    //astarb = !astarb;
    if (astarb) {
        //Astar(pontoStart, pontoEnd);
        DrawAstar();
        //botaoBmc.style.visibility = "hidden";
    }else{
        ReDraw("Astar");
    }
    

}

function ResAstar(){
    if (astarb) {
        caminho = [];
        CalcularAstar();
        clickponto = 0;
        astarSelection = true;
        botaoBmc.style.visibility = "hidden";
    }
}

function Astar(start, end){
    var gn = grafo.getNodos();
    caminho.push(gn[start]);

    var calculando;
    calculando = true;
    var atual, pAtual;
    atual = 0;
    pAtual = gn[start];
    var dEnd, dTotal, dMenor;
    while(calculando){
        dMenor = 1000000;//Para achar o vizinho com a menor distancia do ponto inicial relativo ao ponto final
        for(var i = 0; i < caminho[atual].arestas.length;i++){
            dEnd = dist(sites[caminho[atual].arestas[i].idVizinho], sites[gn[end].id]);
            dTotal = dEnd + caminho[atual].arestas[i].peso;
            if (dTotal < dMenor && !gn[caminho[atual].arestas[i].idVizinho].visitado){
                dMenor = dTotal;
                pAtual = gn[caminho[atual].arestas[i].idVizinho];
                gn[caminho[atual].arestas[i].idVizinho].visitado = true;
            }
        }
            //console.log(dEnd, dTotal);
        caminho.push(pAtual);
        if(pAtual.id == gn[end].id){
            calculando = false;
        }
        else{
            atual++
        }
    }
    console.log(caminho);

    DrawAstar();

}

function DrawAstar(){
    for (var i = 0; i < caminho.length - 1; i++) {
        //ctx.fillStyle = "blue";
        ctx.beginPath();
        ctx.moveTo(sites[caminho[i].id].x, sites[caminho[i].id].y);
        ctx.lineTo(sites[caminho[i + 1].id].x, sites[caminho[i + 1].id].y);
        ctx.strokeStyle = "#05eaff";
        ctx.lineWidth = 4;
        ctx.stroke();
    }

    ctx.fillStyle = "blue";
    ctx.strokeStyle = "#05eaff";
    for (var i = 0; i < caminho.length; i++) {
        ctx.beginPath();
        ctx.arc(sites[caminho[i].id].x, sites[caminho[i].id].y, pSize * 2, 0, 2 * Math.PI);
        ctx.fill();
        ctx.stroke();
    }
}


