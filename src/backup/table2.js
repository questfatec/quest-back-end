//Inicializar o Socket IO
const io = require("socket.io");

//Importar constantes para o Multiplayer
let {
  gameState,
  gameTable,
  numberPlayers,
  namePlayers,
  nameRed,
  nameBlue,
  socketBlue,
  socketRed,
} = require("./constants");

//Inicializar jogador 
function startPlayer(socketId) {
  
  //Adicionar um jogador ao contador
  console.log("ABOBORAS - Iniciando Peão - numberPlayer agora: ", numberPlayers)
  numberPlayers += 1;
  console.log("ABOBORAS - Iniciando Peão - numberPlayer alterado: ", numberPlayers)
  console.log("ABOBORAS - NOVO JOGADOR MULTIPLAYER CONECTADO - Quantidade de Jogadores agora: " + numberPlayers);
 
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

//Inicializar servidor socket
function setupSocket(http) {
  const socketServer = io(http)

  //Rotina após conexão entre cliente e servidor socket
  socketServer.on("connection", (socket) => {

    //Inicializar jogador
    corPeaoJogador = startPlayer(socket.id);

    //Avisar que entrou jogador no Multiplayer
    socketServer.emit("qtdJogadores", numberPlayers, nameRed, nameBlue);
    console.log("ABOBORAS - Quantidade de Jogadores após inicializar o peão: ", numberPlayers)

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

    //Rotina quando jogador Multiplayer desconectar
    socket.on("disconnect", () => {

      //Alterar quantidade de jogadores
      numberPlayers -= 1;

      //Descobrir quem desconectou
      if ((socket.id = socketRed)) {
        console.log("ABOBORAS - Jogador vermelho desconectado");
        nameRed = "Desconectado"
      } else if ((socket.id = socketBlue)) {
        console.log("ABOBORAS - Jogador azul desconectado");
        nameBlue = "Desconectado"
      } else {
        console.log("ABOBORAS - Outro Jogador Indefinido desconectou: " + socket.id);
      }

      //Informar a todos sobre alteração na quantidade de jogadores
      socketServer.emit("qtdJogadores", numberPlayers, namePlayers, nameRed, nameBlue);
      console.log("ABOBORAS - avisando que jogador saiu - ")
    });

    //CHAT
    /* socketServer.emit("chat message", "Novo jogador: " + numberPlayers + " " + corPeaoJogador);

    socket.on("chat message", (msg) => {
      socketServer.emit("chat message", msg);
    }); */
    
  });
}

module.exports = setupSocket
