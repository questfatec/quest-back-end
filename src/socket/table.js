//Inicializar o Socket IO
const io = require("socket.io");

//Importar constantes para o Multiplayer
let {
  gameState,
  gameTable,
  numberPlayers,
  socketBlue,
  socketRed,
} = require("./constants");

//Inicializar jogador 
function startPlayer(socketId) {
  numberPlayers += 1;
  //console.log("NOVO JOGADOR MULTIPLAYER CONECTADO - Quantidade de Jogadores agora: " + numberPlayers);
 
  if (numberPlayers == 1) {
    socketRed = socketId
    return "Jogador Vermelho"
  } else if (numberPlayers == 2) {
    socketBlue = socketId
    return "Jogador Azul"
  } else {
    return "Observador"
  }
}

//Inicializar servidor socket
function setupSocket(http) {
  const socketServer = io(http)

  //Rotina após conexão entre cliente e servidor socket
  socketServer.on("connection", (socket) => {

    //Inicializar jogador
    msgRetorno = startPlayer(socket.id);

    //Avisar que entrou jogador no Multiplayer
    socketServer.emit("qtdJogadores", numberPlayers);

    //Inicializar o tabuleiro ao conectar ao jogo Multiplaye
    socketServer.emit("gameTable", gameTable);
    socketServer.emit("gameState", gameState);

    //Rotina quando jogador Multiplayer desconectar
    socket.on("disconnect", () => {

      numberPlayers -= 1;
      socketServer.emit("qtdJogadores", numberPlayers);

      if ((socket.id = socketRed)) {
        console.log("Jogador vermelho desconectado");
      } else if ((socket.id = socketBlue)) {
        console.log("Jogador azul desconectado");
      } else {
        console.log("Outro Jogador Indefinido desconectou: " + socket.id);
      }

    });

    socket.on("moveRed", (casa) => {
      socketServer.emit("moveRed", casa);
    });

    socket.on("moveBlue", (casa) => {
      socketServer.emit("moveBlue", casa);
    });

    //CHAT
    socketServer.emit("chat message", "Novo jogador: " + numberPlayers + " " + msgRetorno);

    socket.on("chat message", (msg) => {
      socketServer.emit("chat message", msg);
    });
    
  });
}

module.exports = setupSocket
