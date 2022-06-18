const io = require("socket.io");

let {
  jogOnline,
  jogMult,
  gameState,
  gameTable,
  numberPlayers,
  namePlayers,
  nameRed,
  nameBlue,
  socketBlue,
  socketRed,
} = require('./constants')

// OLD - SOCKET (NÃO APAGAR)

//Inicializar jogador 
function startPlayer(socketId) {
  
  //Adicionar um jogador ao contador
  numberPlayers += 1;

  //console.log("NOVO JOGADOR MULTIPLAYER CONECTADO - Quantidade de Jogadores agora: " + numberPlayers);
 
  if (numberPlayers == 1) {
    
    //Guardar SocketID do peão vermelho
    socketRed = socketId

    //Guardar Nome do Peão Vermelho
    nameRed = "Conectado"
    
    //Retornar cor do Jogador
    return "Jogador Vermelho"

  } else if (numberPlayers == 2) {

    //Guardar SocketID do peão azul
    socketBlue = socketId

    //Guardar Nome do Peão Azul
    nameBlue = "Conectado"
    
    //Retornar cor do Jogador
    return "Jogador Azul"

  } else {
    return "Observador"
  }
}



// NOVO - SOCKET

function setupSocket(http) {

  const socketServer = io(http)

  //Rotina após conexão entre cliente e servidor socket
  socketServer.on("connection", (socket) => {

    //console.log("Conexão Socket Ativa - ID:", socket.id)
    //socket.adapter.sids.size

    //Inicializar jogador
    corPeaoJogador = startPlayer(socket.id);

    //Avisar conexão de jogadores
    jogOnline++
    //console.log("Novo jogador CONECTOU. Quantidade de jogadores online agora: ", jogOnline);
    socketServer.emit('jogOnline', {jogOnline})

    //Receber info de Jogador entrou no Multiplayer
    socket.on('jogMultOn', (idJogador) => {
      //jogMult ++
      jogMult.push(socket.id)
      qtdJogMult = jogMult.length
      //console.log("Novo jogador ENTROU NO MULTIPLAYER. Quantidade de jogadores no multiplayer agora: ", qtdJogMult);
      //console.log("Novo jogador ENTROU NO MULTIPLAYER. Quantidade de jogadores Onliner agora: ", jogOnline);
      //socketServer.emit('jogMult', {qtdJogMult})
    })

    //Inicializar o tabuleiro ao conectar ao jogo Multiplaye
    socketServer.emit("gameTable", gameTable);
    socketServer.emit("gameState", gameState);

    //Mover o peão VERMELHO
    socket.on("moveRed", (casa) => {
      socketServer.emit("moveRed", casa);
    });

    //Mover o peão AZUL
    socket.on("moveBlue", (casa) => {
      socketServer.emit("moveBlue", casa);
    });


    socket.on("disconnect", (reason) => {
      //Avisar desconexão de jogadores
      jogOnline = socket.adapter.sids.size
      //console.log("Jogador DESCONECTOU. Quantidade de jogadores online agora: ", jogMult);
      //console.log("Motivo Jogador DESCONECTOU: ", reason)
      //console.log("Quem desconectou: ", socket.id)
      socketServer.emit('jogOnline', {jogOnline})

      //Alterar quantidade de jogadores
      numberPlayers -= 1;

      //Descobrir quem desconectou
      if ((socket.id = socketRed)) {
        console.log("Jogador vermelho desconectado");
        nameRed = "Desconectado"
      } else if ((socket.id = socketBlue)) {
        console.log("Jogador azul desconectado");
        nameBlue = "Desconectado"
      } else {
        console.log("Outro Jogador Indefinido desconectou: " + socket.id);
      }

      //Informar a todos sobre alteração na quantidade de jogadores
      socketServer.emit("qtdJogadores", numberPlayers, namePlayers, nameRed, nameBlue);

    })

  })

}





module.exports = setupSocket