const session = require("express-session")

function load(cat) {

    sessionStorage.setItem('categoriaInicial', cat)

    const info = {
        "playerId": sessionStorage.getItem('_id'),
        "playerName": sessionStorage.getItem('username'),
        "playerFirstCategory": sessionStorage.getItem('categoriaInicial')
    }
 
    $.ajax({
        url:"/game/login",
        type: "PUT",
        data: info, 
        success: (retorno) => {
            corPeao = retorno.corPeao
            jogMult = retorno.qtdJogMult
            posicaoRed = retorno.playerRedPosition
            posicaoBlue = retorno.playerBluePosition
            //console.log("Jogador LOGADO no DB: ", retorno)
            sessionStorage.setItem('corPeao', corPeao)
            sessionStorage.setItem('qtdJogMult', jogMult)
            sessionStorage.setItem('playerRedPosition', posicaoRed)
            sessionStorage.setItem('playerBluePosition', posicaoBlue)
            alert('Iniciando Multiplayer!')
            location.href = "/game/multiplayer"
        },
        error: (xhr) => {
            console.log("Não deu certo o registro do usuário: " + xhr.status + " " + xhr.statusText);
            alert("Infelizmente já há dois jogadores. Por favor aguarde.")
            location.href = "/jogoV3"
        }
    })
}

function carregarMultiplayer(cat) {
    console.log('Categoria selecionada: ', cat)

    load(cat)
}


