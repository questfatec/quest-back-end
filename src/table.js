const gameTable = {
    casas:
      ['início',
        'M', 'S', 'E', 'CT',
        'AE', 'V', 'E', 'S',
        'M', 'CT', 'S', 'V',
        'M', 'AE', 'E', 'M',
        'AE', 'V', 'S', 'CT',
        'E', 'M', 'AE', 'V',
        'M', 'S', 'E', 'CT',
        'fim'],
    cores: {'início': '#19af54',
          'M': '#fd8f36',
          'S': '#a745fb',
          'E': '#8afd40',
          'CT': '#31a6fc',
          'AE': '#fc2c32',
          'V': '#fcfd45',
          'fim': '#19af54'}
}

var numberPlayers = 0;
var socketRed;
var socketBlue;
var gameState = {
    posicaoRed: 0,
    posicaoBlue: 0,
    fichasRed: [true, true, true, true, true],
    fichasblue: [true, true, true, true, true]
};

io.on('connection', (socket) => {
    io.emit('gameTable', gameTable);
    io.emit('gameState', gameState);
    console.log('new connection', socket.id);
    msgRetorno = startPlayer( socket.id);
    io.emit('chat message', 'new player ' + numberPlayers + ' ' + msgRetorno);
    console.log('new player ' + numberPlayers);
    socket.on('disconnect', () => {
        
        if (socket.id=socketRed) {
            console.log('player red disconnected');
        } else if (socket.id=socketBlue) {
            console.log('player blue disconnected');
        } else {
            console.log('user ' + socket.id + ' disconnected');
        }
        numberPlayers -= 1;
    })
    socket.on('chat message', (msg) => {
        io.emit('chat message', msg);
    })

    socket.on('moveRed', (casa) => {
        io.emit('moveRed', casa);
    })
})

function startPlayer(socketId) {
    numberPlayers += 1;
    if (numberPlayers==1){
        socketRed=socketId;
        return 'Jogador Vermelho';
    } else if (numberPlayers==2){
        socketBlue=socketId;
        return 'Jogador Azul';
    } else {
        return 'Observador';
    }
}