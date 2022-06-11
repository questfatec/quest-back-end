  // ****** socket connection code **********

  var socket = io();

  var messages = document.getElementById('messages');
  var form = document.getElementById('form');
  var input = document.getElementById('input');

  socket.on('moveRed', function (casa) {
    posicaoRed = casa;
  })
  // ****************************************

  var posicaoRed = 0;
  var posicaoBlue = 0;
  var fichaAposta = [true, true, true, true, true];

  var tempo = 15;
  var timerOn;
  var posicao = 0;
  var canvas = document.getElementById("canvas");
  var ctx = canvas.getContext("2d");
  var radius = canvas.height / 2;
  ctx.translate(radius, radius);
  radius = radius * 0.90

  function checkFicha(ficha) {
    return !ficha;
  }

  canvas.addEventListener('click', (event) => {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    for (var i = 0; i < 5; i++) {
      distance = Math.sqrt(Math.pow(x - (i * 130 + 240), 2) + Math.pow(y - 500, 2));
      if (distance < 50) {
        fichaAposta[i] = false;
        timerOn = setInterval(decTempo, 1000);
        socket.emit('moveRed', posicaoRed + i + 1);
        if (fichaAposta.every(checkFicha)) {
          fichaAposta = [true, true, true, true, true];
        }
        drawClock();
      }
    }
  })

  var gameTable;
  socket.on('gameTable', function (msg) {
    gameTable = msg;
  })

  function decTempo() {
    tempo = tempo - 1;
  }

  setInterval(drawClock, 1000);
  // drawClock();
  function drawClock() {
    drawTabuleiro(ctx, radius);
    drawCasas(ctx, radius);
    drawPecas(ctx, radius);
    drawText(ctx);
    drawText2(ctx);
    drawFichas(ctx);
    drawTimer(ctx);
  }

  function drawTabuleiro(ctx, radius) {
    var grad;

    ctx.beginPath();
    ctx.arc(0, 0, radius, 0, 2 * Math.PI);
    ctx.fillStyle = 'white';
    ctx.fill();

    grad = ctx.createRadialGradient(0, 0, radius * 0.95, 0, 0, radius * 1.05);
    grad.addColorStop(0, '#333');
    grad.addColorStop(0.5, 'white');
    grad.addColorStop(1, '#333');
    ctx.strokeStyle = grad;
    ctx.lineWidth = radius * 0.1;
    ctx.stroke();

    ctx.beginPath();
    //ctx.arc(0, 0, radius * 0.1, 0, 2 * Math.PI);
    ctx.fillStyle = '#333';
    ctx.fill();
  }

  function drawCasas(ctx, radius) {
    var ang;
    var num;

    ctx.font = "bold " + radius * 0.10 + "px arial";
    ctx.textBaseline = "middle";
    ctx.textAlign = "center";
    ctx.fillStyle = 'white';

    for (num = 0; num < 30; num++) {
      ang = num * Math.PI / 15 + Math.PI + 0.08;
      ctx.rotate(ang);
      ctx.translate(0, -radius * 0.85);
      // ctx.rotate(-ang);
      ctx.fillStyle = gameTable.cores[gameTable.casas[num]];
      //ctx.fillStyle = corCasa(casas[num])
      ctx.beginPath();
      if (num == 0 || num == 29) {
        ctx.moveTo(-44, -60);
        ctx.lineTo(44, -60);
        ctx.lineTo(30, 65);
        ctx.lineTo(-34, 65);
      } else {
        ctx.moveTo(-42, -45);
        ctx.lineTo(44, -45);
        ctx.lineTo(32, 45);
        ctx.lineTo(-35, 45);
      }
      ctx.fill();
      if (num == 0) {
        ctx.rotate(ang - Math.PI / 2);
      } else if (num == 29) {
        ctx.rotate(-ang + Math.PI / 2);
      }
      ctx.fillStyle = 'white';
      ctx.fillText(gameTable.casas[num], 0, 0);
      //ctx.fillText(casas[num], 0, 0);
      if (num == 0) {
        ctx.rotate(-ang + Math.PI / 2);
      } else if (num == 29) {
        ctx.rotate(ang - Math.PI / 2);
      }
      ctx.translate(0, radius * 0.85);
      ctx.rotate(-ang);
    }
  }

  function drawPecas(ctx, radius) {
    posicaoCasaRed = posicaoRed * Math.PI / 15 + Math.PI + 0.08
    posicaoCasaBlue = posicaoBlue * Math.PI / 15 + Math.PI + 0.08
    drawPecaRed(ctx, posicaoCasaRed, radius * 0.9, radius * 0.02);
    drawPecaBlue(ctx, posicaoCasaBlue, radius * 0.9, radius * 0.02);
  }

  function drawPecaRed(ctx, pos, length, width) {
    ctx.beginPath();
    ctx.lineWidth = width;
    ctx.lineCap = "round";
    ctx.strokeStyle = "white"
    ctx.moveTo(0, 0);
    ctx.rotate(pos);
    ctx.beginPath();
    ctx.strokeStyle = "red";
    ctx.lineWidth = 12;
    ctx.arc(0, -400, 6, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.beginPath();
    ctx.strokeStyle = "black";
    ctx.lineWidth = 2;
    ctx.arc(0, -400, 12, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.rotate(-pos);
  }

  function drawPecaBlue(ctx, pos, length, width) {
    ctx.beginPath();
    ctx.lineWidth = width;
    ctx.lineCap = "round";
    ctx.strokeStyle = "white"
    ctx.moveTo(0, 0);
    ctx.rotate(pos);
    ctx.beginPath();
    ctx.strokeStyle = "blue";
    ctx.lineWidth = 12;
    ctx.arc(0, -360, 6, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.beginPath();
    ctx.strokeStyle = "black";
    ctx.lineWidth = 2;
    ctx.arc(0, -360, 12, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.rotate(-pos);
  }

  function drawText(ctx) {
    ctx.font = "55px arial";
    ctx.textBaseline = "middle";
    ctx.textAlign = "center";
    ctx.fillStyle = "black";
    ctx.fillText("FAÇA SUA APOSTA!", 0, -150);
  }

  function drawText2(ctx) {
    var a = 0;
    var b = 150;
    var lineheight = 25;
    var str = "Se você acertar a pergunta, você andará o número\n" +
      "apostado de casas. Após utilizar todas as fichas\n" +
      "disponíveis, elas zeram."
    var linhas = str.split('\n');
    ctx.font = "25px arial";
    ctx.textBaseline = "middle";
    ctx.textAlign = "center";
    ctx.fillStyle = "black";
    for (var j = 0; j < linhas.length; j++)
      ctx.fillText(linhas[j], a, b + (j * lineheight));
  }

  function drawFichas(ctx) {
    ctx.font = "bold 30px arial";
    for (var i = 0; i < 5; i++) {
      if (fichaAposta[i]) {
        ctx.beginPath();
        ctx.strokeStyle = "orange";
        ctx.lineWidth = 25;
        ctx.arc(i * 130 - 260, 0, 40, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.beginPath();
        ctx.strokeStyle = "black";
        ctx.lineWidth = 5;
        ctx.arc(i * 130 - 260, 0, 50, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.fillText(i + 1, i * 130 - 260, 0);
      }
    }
  }
  function drawTimer(ctx) {
    ctx.font = "bolder 45px Arial";
    ctx.textBaseline = "middle";
    ctx.textAlign = "center";
    if (tempo > 10) {
      ctx.fillStyle = "green";
    } else if (tempo > 5) {
      ctx.fillStyle = "orange";
    } else {
      ctx.fillStyle = "red";
    }
    if (tempo == 0) {
      ctx.fillText("Tempo Esgotado!", 0, -250);
      tempo = 15;
      clearInterval(timerOn);
    } else {
      ctx.fillText(tempo, 0, -250);
    }
  }

  window.onunload = function () {
    window.scrollTo(0, 0);
  }

  