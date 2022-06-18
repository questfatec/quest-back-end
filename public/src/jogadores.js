var socket = io();

socket.on('qtdJogadores', function (qtdJogadores) {
    console.log('SOCKET - qtdJogadores' , qtdJogadores)
})