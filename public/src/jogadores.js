let {socket} = require('./game/start')

socket.on('qtdJogadores', function (qtdJogadores) {
    console.log('SOCKET - JOGADORES*- qtdJogadores' , qtdJogadores)
})