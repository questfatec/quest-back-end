var socket = io();

let corPeao = sessionStorage.getItem('corPeao')
let categoriaInicial = sessionStorage.getItem('categoriaInicial')

if(corPeao == 'red') {

    document.getElementById('jogadorUm').innerHTML = 'Entrou!'
    document.getElementById('peaoFront').innerHTML = 'Vermelho'

} else if (corPeao = 'blue') {

    document.getElementById('jogadorUm').innerHTML = 'Entrou!'
    document.getElementById('jogadorDois').innerHTML = 'Entrou!'
    document.getElementById('peaoFront').innerHTML = 'Azul'

} else {
    alert('Você não devia estar aqui...')
    location.href('/jogoV3')
}

document.getElementById('perguntaRodada_categoria').innerHTML = categoriaInicial



/*

var client_jogOnline = 0 , client_jogMult = 0

socket.on('jogOnline', function(jogOnline) {
    console.log('Qtd Jog Online: ', jogOnline.jogOnline)
    /* document.getElementById('jogOnline').innerHTML = jogOnline.jogOnline
    document.getElementById('jogOnline').value = jogOnline.jogOnline */
    /*client_jogOnline = jogOnline.jogOnline
})

socket.on('jogMult', function(jogMult) {
    console.log('Qtd Jog Multiplayer: ', jogMult.jogMult)
    document.getElementById('jogMult').innerHTML = jogMult.jogMult
    document.getElementById('jogMult').value = jogMult.jogMult
    client_jogMult = jogMult.jogMult
})

function iniciarMultiplayer() {

    if(client_jogMult < 0) {
        alert("Erro do Jogo! AVISE O BRUNO!")
    } else if (client_jogMult < 2) {
        socket.emit('jogMultOn', sessionStorage.getItem('_id'))
        
    } else {
        alert("Infelizmente já tem dois jogadores online! Por favor aguarde!")
    }
    
} */