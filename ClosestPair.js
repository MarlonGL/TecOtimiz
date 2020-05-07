//variaveis
var canvas;
var ctx;
var pontos = [];
var pSize = 4;
var width;
var height;
var ponto1 = {x:0, y:0};
var ponto2= {x:0, y:0};
var minDist;
//var ptemp1 = {x:0, y:0}, ptemp2 = {x:0, y:0}, ptemp3 = {x:0, y:0}, ptemp4 = {x:0, y:0};

function dist(p1, p2)
{
	return Math.sqrt((p1.x - p2.x)*(p1.x - p2.x) + (p1.y - p2.y)*(p1.y - p2.y));
}
function brutal(P, n, pp1, pp2)
{
	var minimo = 9999;
	for (var i = 0; i < n; i++) {
		for (var j = i + 1; j < n; j++) {
			var p = P[i], q = P[j];
			var d = dist(p, q);
			if (d < minimo) {
				minimo = d;
                pp1.x = P[i].x;
                pp1.y = P[i].y;
                pp2.x = P[j].x;
                pp2.y = P[j].y;
                //console.log(ponto1, ponto2, min);
			}
		}
	}
	return {min:minimo, po1:pp1, po2:pp2};
}

canvas = document.getElementById('ClosestPair');
ctx = canvas.getContext("2d");

width = canvas.width;
height = canvas.height;

ctx.fillStyle = "black";
ctx.fillRect(0, 0, width, height);

ctx.translate(width/2, height/2);

//pontos
/**/

function CleanCanvas() {
    ctx.clearRect(-width/2, -height/2, width, height);
    ctx.fillStyle = "black";
    ctx.fillRect(-width/2, -height/2, width, height);
}



function PontosDefinidos(){
    CleanCanvas();
    pontos = [];
    ponto1 = { x: 0, y: 0 };
    ponto2 = { x: 0, y: 0 };
    pontos = [ {x:-13, y:0.5}, {x:-10.5, y:-11.5},
    {x:-10, y:9}, {x:-4.5, y:-2}, {x:-1, y:8.5},
    {x:0.5, y:6}, {x:0.5, y:-12}, {x:2, y:12.5},
    {x:3.5, y:11}, {x:5.5, y:3}, {x:5.5, y:-7},
    {x:5, y:11.5}, {x:6.5, y:3.2}, {x:7, y:-10},
    {x:9, y:-5}, {x:11.5, y:-4} ];

    for (var i = 0; i < pontos.length; i++) {
        pontos[i].x = pontos[i].x * 15;
        pontos[i].y = pontos[i].y * 15;
    }
    pontos.sort(function (a, b) {
        return a.x != b.x ? a.x - b.x : a.y - b.y;
    });
    DrawPontos();
    minDist = closestDivideAndConquer(pontos, pontos.length, ponto1, ponto2);
    //minDist = brutal(pontos, pontos.length, ponto1, ponto2);
    console.log(minDist.po1, minDist.po2, minDist.min);
    finalDraw();
}

function PontosAleatorios() {
    CleanCanvas();
    pontos = [];
    ponto1 = { x: 0, y: 0 };
    ponto2 = { x: 0, y: 0 };
    var w = width - 50;
    var h = height - 50;
    var tam = 16;
    for (var i = 0; i < tam; i++) {
        var xx = Math.round((Math.random() * w) - w/2);
        var yy = Math.round((Math.random() * h) - h/2);
        pontos.push({ x: xx, y: yy});
    }
    pontos.sort(function (a, b) {
        return a.x != b.x ? a.x - b.x : a.y - b.y;
    });
    DrawPontos();
    minDist = closestDivideAndConquer(pontos, pontos.length, ponto1, ponto2);
    //minDist = brutal(pontos, pontos.length, ponto1, ponto2);
    console.log(minDist.po1, minDist.po2, minDist.min);
    finalDraw();
}

function DrawPontos() {
    ctx.fillStyle = "white";
    ctx.strokeStyle = "white";
    for (var i = 0; i < pontos.length; i++) {
        ctx.beginPath();
        ctx.arc(pontos[i].x, pontos[i].y, pSize, 0, 2 * Math.PI);
        ctx.lineWidth = 1;
        ctx.fill();
        ctx.stroke();    
    }
}



function closestDivideAndConquer(ps, tam, pp1, pp2){
    var ptemp1 = {x:0, y:0}, ptemp2 = {x:0, y:0}, ptemp3 = {x:0, y:0}, ptemp4 = {x:0, y:0};

    /*if(tam == 1){
        return 10000;
    }
    else if(tam == 2){
        return dist(ps[0], ps[1]);
    }*/
    if(tam <= 3){
        var bruts;
        bruts = brutal(ps, tam, ptemp1, ptemp2);
        return {min:bruts.min, po1:bruts.po1, po2:bruts.po2};
    }
    var m = Math.floor(tam/2);
    var medio;
    medio = ps[m];
    //console.log(pontos[m] + " medio");
    //console.log(ps+m);
    var p1 = [];
    var p2 = [];
    p1 = ps.slice(0, m);
    p2 = ps.slice(m);

    var d1;
    d1 = closestDivideAndConquer(p1, p1.length, ptemp1, ptemp2);
    var d2;
    d2 = closestDivideAndConquer(p2, p2.length, ptemp3, ptemp4);
    
    //console.log(d1 + " d1 " + d2 + " d2");
    //var pAtual;
    //pAtual=  d1.ppp;

    if(d1.min < d2.min){
        pp1 = d1.po1;
        pp2 = d1.po2;
    }
    else{
        pp1 = d2.po1;
        pp2 = d2.po2;
    }
    //console.log(pp1, pp2);
    var d3;
    d3 = Math.min(d1.min,d2.min);

    var pMedios = [];
    for(var i = 0; i < ps.length; i++){
        if(Math.abs(ps[i].x - medio.x) < d3){
            pMedios.push(ps[i]);
        }
    }
    var pt1, pt2;
    pt1 = {x:0, y:0};
    pt2 = {x:0, y:0};
    var minimo = d3;
    for(var i = 0; i < pMedios.length; i++){
        for (var j = i+1; j < pMedios.length && (pMedios[j].y - pMedios[i].y) < minimo; j++)
		{
			if (dist(pMedios[i], pMedios[j]) < minimo) {
				minimo = dist(pMedios[i], pMedios[j]);
				pt1 = pMedios[i];
                pt2 = pMedios[j];
                //pAtual = [pMedios[i], pMedios[j]];
			}
		}
    }

    var minFinal;
    minFinal = d3;
    if(minimo < d3){
        //console.log("minimo < d3");
        pp1 = pt1;
        pp2 = pt2;
        minFinal = minimo;
    }
    return {min:minFinal, po1:pp1, po2:pp2};
    //return {distancia:minimo, ppp:pAtual};
}


function finalDraw(){
    ctx.beginPath();
    ctx.strokeStyle = "yellow";
    ctx.moveTo(minDist.po1.x, minDist.po1.y);
    ctx.lineTo(minDist.po2.x, minDist.po2.y);
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.fillStyle = "red";
    ctx.beginPath();
    ctx.arc(minDist.po1.x, minDist.po1.y, pSize, 0, 2 * Math.PI);
    ctx.lineWidth = 1;
    ctx.fill();
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(minDist.po2.x, minDist.po2.y, pSize, 0, 2 * Math.PI);
    ctx.lineWidth = 1;
    ctx.fill();
    ctx.stroke();
    //ctx.fillRect(minDist.po1.x, minDist.po1.y, pSize, pSize);
    //ctx.fillRect(minDist.po2.x, minDist.po2.y, pSize, pSize);
}
