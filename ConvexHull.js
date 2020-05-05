//variaveis
var canvas;
var ctx;
var pontos = [];
var pSize = 4;
var hull = [];
var pAtual = 0;
//var s1 = [];
//var s2 = [];
var width;
var height;

function dotProduct(vec1, vec2) {
    return (vec1.x * vec2.x + vec1.y * vec2.y);
}
function cross_product(p1, p2){
    return((p1.x * p2.y) - (p2.x * p1.y));
}
function norm(vec) {
    return Math.sqrt(vec.x * vec.x + vec.y * vec.y);
}
function computeAngle(v1, v2) {
    var ac = dotProduct(v1, v2);
    return Math.acos(ac / (norm(v1) * norm(v2))) * ONE_RADIAN;
}
function EuclidianDistance(p1, p2){
    return Math.sqrt(((p2.y - p1.y) * (p2.y - p1.y)) + ((p2.x - p1.x) * (p2.x - p1.x)));
}
function DistancePointSeg(p1, p2, C){
    return Math.abs((p2.x - p1.x) * (p1.y - C.y) - (p2.y - p1.y) * (p1.x - C.x))/EuclidianDistance(p1, p2);
}
function dist_linha_ponto(p2, p1, p0){
    var x = 0;
    var y = 0;
    var n = ((p2.y - p1.y)* p0.x - (p2.x - p1.x) * p0.y + p2.x * p1.y - p2.y * p1.x);
    var d = Math.sqrt((p2.y - p1.y)** 2 + (p2.x - p1.x) **2);
    return n/d;
}
function separarSegmentos(A, B, P, s0, s1){
    var d;
    for(var i = 0; i<P.length;i++){
        d = dist_linha_ponto(A, B, P[i]);
        if(d > 0){
            s0.push(P[i]);
        }
        else if(d < 0){
            s1.push(P[i]);
        }
    }
}

function separarSegmento(P, S, A, B){
    for(var i = 0; i<P.length;i++){
        if(dist_linha_ponto(A, B, P[i]) > 0){
            S.push(P[i]);
        }
    }
}

canvas = document.getElementById('ConvexHull1');
ctx = canvas.getContext("2d");

width = canvas.width;
height = canvas.height;

ctx.fillStyle = "black";
ctx.fillRect(0, 0, width, height);

ctx.translate(width/2, height/2);

//pontos
/*pontos = [ {x:-13, y:0.5}, {x:-10.5, y:-11.5},
    {x:-10, y:9}, {x:-4.5, y:-2}, {x:-1, y:8.5},
    {x:0.5, y:6}, {x:0.5, y:-12}, {x:2, y:12.5},
    {x:3.5, y:11}, {x:5.5, y:3}, {x:5.5, y:-7},
    {x:5, y:11.5}, {x:6.5, y:3.2}, {x:7, y:-10},
    {x:9, y:-5}, {x:11.5, y:-4} ];*/
    var tam = Math.floor((Math.random()* 20) + 20);
    
    for(var i=0;i<tam;i++){
        var xx = Math.round((Math.random()* 30) - 15);
        var yy = Math.round((Math.random()* 30) - 15);
        pontos.push({x:xx, y:yy});
    }
    pontos.sort(function (a, b) {
    return a.x != b.x ? a.x - b.x : a.y - b.y;
});

ctx.fillStyle = "white";
for(var i=0;i<pontos.length;i++){
    ctx.fillRect(pontos[i].x * 15, pontos[i].y * 15, pSize, pSize);
}

//console.log(pontos);
console.log(pontos.length);
QuickHull();


function QuickHull(){
    var a = pontos[0];
    var b = pontos[pontos.length-1];
    hull.push(a);
    hull.push(b);

    var s0 = [];
    var s1 = [];
    separarSegmentos(a, b, pontos, s0, s1);
    /*ctx.fillStyle = "yellow";
    for(var i=0;i<s0.length;i++){
        ctx.fillRect(s0[i].x * 15, s0[i].y * 15, pSize, pSize);
    }*/
    //console.log(hull.indexOf(b));
    FindHull(s0, a, b, hull);
    hull.push(hull[0]);
    FindHull(s1, b, a, hull);
    
    //adicionara o primeiro ponto dnovo para fechar o hull
    hull.push(hull[0]);
    
    DrawConvexHull();

    //console.log(hull);
    //FindS(s1, hull[0], hull[1]);
}

function FindHull(s, p1, p2, cHull){
    if(s.length == 0){
        return;
    }
    var sec1 = [];
    var sec2 = [];
    var maisLonge;
    var dist = -99999;
    var d;
    for(var i = 0; i<s.length;i++){
        //d = dist_linha_ponto(p1, p2, s[i]);
        d = DistancePointSeg(p1, p2, s[i]);
        //if(d>= 0 && dist < d){
        if(dist <= d){

            maisLonge = i;
            dist = d;
        }
    }
    if(maisLonge == null){
        //console.log("mais longe null");
        return;
    }
    //adicionar no array do hull
    var c = s[maisLonge];
    var i = cHull.lastIndexOf(p1);
    var j = cHull.lastIndexOf(p2);
    var pos = Math.max(i, j);
    cHull.splice(pos, 0, c);

    separarSegmento(s, sec1, p1, c);
    //separarSegmentos(p1, c, s, s3, s4);
    FindHull(sec1, p1, c, cHull, false);
    //separarSegmentos(c, p2, s, tempS, s4);
    separarSegmento(s, sec2, c, p2);
    //console.log(s4);
    FindHull(sec2, c, p2, cHull, false);

}
function DrawConvexHull(){
    ctx.fillStyle = "yellow";
    for(var i=0;i<hull.length - 1;i++){
        ctx.moveTo(hull[i].x * 15, hull[i].y * 15);
        ctx.lineTo(hull[i + 1].x * 15, hull[i + 1].y * 15);
        ctx.strokeStyle = "yellow";
        //ctx.lineWidth = 2;
        ctx.stroke();
    }
    ctx.fillStyle = "red";
    for(var i=0;i<hull.length;i++){
        ctx.fillRect(hull[i].x * 15, hull[i].y * 15, pSize, pSize);
    }
}