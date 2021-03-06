var socket = io();

socket.on("connect", () => {

    let ownSocketID = socket.id
    sessionStorage.setItem('ownSocketID', ownSocketID)

    let corPeao = sessionStorage.getItem('corPeao')
    let categoriaInicial = sessionStorage.getItem('categoriaInicial')

    if(corPeao == 'red') {

        document.getElementById('jogadorUm').innerHTML = 'Entrou (Você)!'
        document.getElementById('peaoFront').innerHTML = 'Vermelho'

    } else if (corPeao = 'blue') {

        document.getElementById('jogadorUm').innerHTML = 'Entrou!'
        document.getElementById('jogadorDois').innerHTML = 'Entrou (Você)!'
        document.getElementById('peaoFront').innerHTML = 'Azul'

        canvas = document.getElementById('canvas')
        canvas.style.display = "Block"

        socket.emit('avisaVermelhoQueAzulEntrou', ownSocketID)

    } else {
        alert('Você não devia estar aqui...')
        location.href('/jogoV3')
    }

    document.getElementById('perguntaRodada_categoria').innerHTML = categoriaInicial


    //Código para avisar que Azul (Player 2) também entrou
    socket.on("avisaVermelhoQueAzulEntrou", function(ownSocketID) {
        
        avisoTabuleiro = document.getElementById('avisoTabuleiro')
        avisoTabuleiro.style.display = "None"
        
        if(corPeao == 'red') {
            console.log('SOCKET - FRONT - AVISO - Azul entrou também...', ownSocketID)
            document.getElementById('jogadorDois').innerHTML = 'Entrou!'

            canvas = document.getElementById('canvas')
            canvas.style.display = "Block"
        }

        $.ajax({
            url:"/game/list",
            type: "GET",
            success: (retorno) => {
                jogMult = retorno[0].qtdJogMult
                console.log("teste JogMult: ", jogMult)
                sessionStorage.setItem('qtdJogMult', jogMult)
                document.getElementById('jogMult').innerHTML = jogMult

                console.log('Resultado Atualização do jogo: ', retorno[0])

            },
            error: (xhr) => {
                console.log("Não deu certo a consulta...: " + xhr.status + " " + xhr.statusText);
                alert("Não foi possível obter os dados do Jogador Azul...")
                location.href = "/jogoV3"
            }
        })

        if(corPeao == 'blue') {
            //avisar quem pediu para passar a vez
            socket.emit("passarRodadaParaOutro", corPeao)
        }

        //new Audio('/audio/Entrada.mp3').play()
        
        
    })

    //Código para controle da rodada no front
    socket.on("passarRodadaParaOutro", (vezDeQuem) => {
        console.log('Alteração - Quem Joga agora: ', vezDeQuem)
        if(vezDeQuem == 'red') {
            document.getElementById('quemJoga').innerHTML = "Vermelho"
        } else if (vezDeQuem == 'blue') {
            document.getElementById('quemJoga').innerHTML = "Azul"
        } else {
            console.log('SOCKET - FRONT - Não consegui saber de quem era a vez...')
        }

        corPeao = sessionStorage.getItem('corPeao')
        if(vezDeQuem == corPeao) {
            //alert('SUA VEZ DE JOGAR!')
        } else {
            //alert('Aguarde pelo outro jogador...')
        }
        

        if (fichaAposta.every(checkFicha)) {
            fichaAposta = [true, true, true, true, true];
        }
    })

    //Código para avisar que o jogo acabou
    socket.on('ganhador', (corPeao) => {
        cliente = sessionStorage.getItem('corPeao') 
        
        if(cliente == corPeao) {
            alert("VOCÊ VENCEU!")
        } else {
            alert("VOCÊ PERDEU!")
        }

        alert('Atenção, temos um vencedor...!')
        alert("Redirecionando para o lobby, por favor aguarde.")
        
        location.href='/jogov3'

        socket.disconnect()
    })


    /////// CÓDIGO TABULEIRO    
    //Cria variáveis com a posição inicial dos peões
    var posicaoRed = sessionStorage.getItem('playerRedPosition');
    var posicaoBlue = sessionStorage.getItem('playerBluePosition');

    //Define o valor da posição inicial
    //var posicao = 0;

    //Emite para todos os jogadores a casa em que o peão vermelho está agora
    socket.on('moveRed', function (casa) {
        posicaoRed = casa;
    })

    //Emite para todos os jogadores a casa em que o peão vermelho está agora
    socket.on('moveBlue', function (casa) {
        posicaoBlue = casa;
    })

    //Define variável para exibição das fichas
    var fichaAposta = [true, true, true, true, true]; 

    //Define valor inicial do tempo
    var tempo = 15;

    // ???
    var timerOn;

    //Guarda referência do Canvas em uma variável
    var canvas = document.getElementById("canvas");

    //Guarda contexto do Canvas
    var ctx = canvas.getContext("2d");

    //Desenho do canvas - tabuleiro na tela
    var radius = canvas.height / 2;
    ctx.translate(radius, radius);
    radius = radius * 0.90

    //Par retornar V ou F se existir a ficha
    function checkFicha(ficha) {
        return !ficha;
    }

    //Evento que acontece ao clicar na ficha
    canvas.addEventListener('click', (event) => {

        console.log('corPeao que clicou na ficha: ', corPeao)
        vezDeQuem = document.getElementById('quemJoga').innerHTML
        console.log('Vez de quem: ', vezDeQuem)
        
        if((vezDeQuem == 'Vermelho' && corPeao == 'red') || (vezDeQuem == 'Azul' && corPeao == 'blue')) {
                
            //Para descobrir em qual ficha clicou

            //Referência da posição do click no Canvas (ONDE CLICOU)
            const rect = canvas.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;

            //Com a posição X/Y do click, identificar qual ficha deve ocultar
            for (var i = 0; i < 5; i++) {
                
                //Limitar quando clicou na ficha ou não
                distance = Math.sqrt(Math.pow(x - (i * 130 + 240), 2) + Math.pow(y - 500, 2));
                
                if (distance < 50) {

                    //sumir com a ficha que clicou e inicar o tempo
                    fichaAposta[i] = false;

                    //avisar que vai começar
                    //alert('HORA DA PERGUNTA...VOCÊ TEM 15 SEGUNDOS!')


                    //ativar timer
                    timerOn = setInterval(decTempo, 1000);

                    //iniciar rotina pergunta e informar quantos pontos valem a pergunta
                    iniciar(i+1)

                    new Audio('/audio/certaResposta.mp3').play()
                }

            }

        } else {
            aviso = "POR FAVOR AGUARDE SUA VEZ. Quem deve jogar agora é o " +vezDeQuem + "."
            console.log(aviso)
            alert(aviso)
        }
    })

    //Para começar a exibir os dados do tabuleiro com o que está vindo do backend
    var gameTable;
    socket.on('gameTable', function (msg) {
        gameTable = msg;
    })

    //Função para reduzir o tempo
    function decTempo() {
        tempo = tempo - 1;
    }

    //Frequência de atualização do tempo - 1000ms é 1s
    setInterval(drawClock, 1000);

    //Função Mãe para desenhar o tabuleiro
    function drawClock() {
        drawTabuleiro(ctx, radius);
        drawCasas(ctx, radius);
        drawPecas(ctx, radius);
        drawText(ctx);
        drawText2(ctx);
        drawFichas(ctx);
        drawTimer(ctx);
    }


    //Função para desenhar o tabuleiro
    function drawTabuleiro(ctx, radius) {
        var grad;

        ctx.beginPath();
        ctx.arc(0, 0, radius, 0, 2 * Math.PI);
        ctx.fillStyle = 'white';
        ctx.fill();

        grad = ctx.createRadialGradient(0, 0, radius * 0.9, 0, 0, radius * 1.1);
        grad.addColorStop(0, '#666');
        grad.addColorStop(0.5, 'white');
        grad.addColorStop(1, '#666');
        ctx.strokeStyle = grad;
        ctx.lineWidth = radius * 0.1;
        ctx.stroke();

        ctx.beginPath();
        //ctx.arc(0, 0, radius * 0.1, 0, 2 * Math.PI);
        ctx.fillStyle = '#333';
        ctx.fill();
    }


    //função para desenhar as casas do tabuleiro
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


    //função para inicializar as casas no tabuleiro
    function drawPecas(ctx, radius) {
        posicaoCasaRed = posicaoRed * Math.PI / 15 + Math.PI + 0.08
        posicaoCasaBlue = posicaoBlue * Math.PI / 15 + Math.PI + 0.08
        drawPecaRed(ctx, posicaoCasaRed, radius * 0.9, radius * 0.02);
        drawPecaBlue(ctx, posicaoCasaBlue, radius * 0.9, radius * 0.02);
    }


    ///função para inicializar o peão vermelho no tabuleiro
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


    ///função para inicializar o peão azul no tabuleiro
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


    //Função para escrever para escolher fazer a aposta
    function drawText(ctx) {
        ctx.font = "55px arial";
        ctx.textBaseline = "middle";
        ctx.textAlign = "center";
        ctx.fillStyle = "black";
        ctx.fillText("FAÇA SUA APOSTA!", 0, -150);
    }


    //Função para escrever explicação do jogo
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


    //Função para exibir as fichas
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

    //Função para desenhar o timer na tela
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

            //Fazer as perguntas sumirem
            perguntasFront = document.getElementById('perguntasFront')
            perguntasFront.style.display = 'none'

            tempo = 15;
            clearInterval(timerOn);

        } else {
            ctx.fillText(tempo, 0, -250);
        }
    }


});





