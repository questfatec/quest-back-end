const io = require("socket.io");
let {
  gameState,
  gameTable,
  numberPlayers,
  socketBlue,
  socketRed,
} = require("./constants");

function startPlayer(socketId) {
  numberPlayers += 1;
  console.log("NOVO JOGADOR MULTIPLAYER - Quantidade de Jogadores agora: " + numberPlayers);
  if (numberPlayers == 1) {
    socketRed = socketId;
    return "Jogador Vermelho";
  } else if (numberPlayers == 2) {
    socketBlue = socketId;
    return "Jogador Azul";
  } else {
    return "Observador";
  }
}

function setupSocket(http) {
  const socketServer = io(http)

  socketServer.on("connection", (socket) => {

    console.log("Novo Jogador Multiplayer Ativo: ", socket.id);

    socketServer.emit("gameTable", gameTable);
    socketServer.emit("gameState", gameState);

    msgRetorno = startPlayer(socket.id);

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

    socket.on('qtdJogadores', function (qtdJogadores) {
      qtdJogadores += 1
      console.log("socket - qtd Jog: ". qtdJogadores)
    })

    
    //CHAT
    socketServer.emit("chat message", "Novo jogador: " + numberPlayers + " " + msgRetorno);

    socket.on("chat message", (msg) => {
      socketServer.emit("chat message", msg);
    });
    
  });
}

module.exports = setupSocket
