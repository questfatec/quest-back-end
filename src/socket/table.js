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

    socketServer.emit("gameTable", gameTable);

    socketServer.emit("gameState", gameState);

    console.log("new connection", socket.id);

    msgRetorno = startPlayer(socket.id);

    socketServer.emit("chat message", "new player " + numberPlayers + " " + msgRetorno);
    
    console.log("new player " + numberPlayers);
    socket.on("disconnect", () => {
      if ((socket.id = socketRed)) {
        console.log("player red disconnected");
      } else if ((socket.id = socketBlue)) {
        console.log("player blue disconnected");
      } else {
        console.log("user " + socket.id + " disconnected");
      }
      numberPlayers -= 1;
    });
    socket.on("chat message", (msg) => {
      socketServer.emit("chat message", msg);
    });

    socket.on("moveRed", (casa) => {
      socketServer.emit("moveRed", casa);
    });
  });
}

module.exports = setupSocket
