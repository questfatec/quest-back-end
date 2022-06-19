const io = require("socket.io");
const Game = require('../models/game')
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

    console.log("SOCKET - Conexão Socket Ativa - ID:", socket.id)
    //socket.adapter.sids.size

    //Inicializar jogador
    corPeaoJogador = startPlayer(socket.id);
    console.log('SOCKET - Cor do Peão após iniciar: ', corPeaoJogador)

    //Aviso que o Jogador Azul entrou
    socket.on("avisaVermelhoQueAzulEntrou", (SocketIDAzul) => {
      console.log('SOCKET - BACKEND - AVISO - Azul entrou também...', SocketIDAzul )
      socketServer.emit("avisaVermelhoQueAzulEntrou", SocketIDAzul);
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

    //Rotina para desconexão do jogador
    socket.on("disconnect", (reason) => {

      //Zerar tabela para poder reiniciar ou entrar no jogo multiplayer outra vez

      async function logreg() {

        //Função para buscar hora atual
        var dataagora = new Date()

        function ajustaDataHoraParaBrasil2() {
          var dataISO = dataagora.toISOString();
          var dataAno = dataISO.substr(0, 4);
          var dataMes = dataISO.substr(5, 2) - 1;
          var dataDia = dataISO.substr(8, 2);
          var dataHoraBR = dataISO.substr(11, 2) - 6;
          var dataMinBR = dataISO.substr(14, 2);
          var dataBR = new Date(dataAno, dataMes, dataDia, dataHoraBR, dataMinBR, 0, 0);
          return dataBR;
        }
    
        const horaAgora = ajustaDataHoraParaBrasil2()
    
        console.log("Iniciando registro para zerar jogo - logreg...")
        
        await Game.updateOne(
            { "_id" : id } ,
            { "$set" : { 
                "qtdJogMult": 0,
                "playerRedId": null,
                "playerRedName": null,
                "playerRedPosition": 0,
                "playerRedConnectedAt": null,
                "playerRedFirstCategory": null,
                "playerBlueId": null,
                "playerBlueName": null,
                "playerBluePosition": 0,
                "playerBlueConnectedAt": null,
                "playerBlueFirstCategory": null,
                "lastUpdate": horaAgora
            }
        })
        
        const retorno = await Game.findOne({"_id": id})
        qtdJogMult = retorno.qtdJogMult
        console.log("ZERANDO - Quantidade de Jogadores no Multiplayer foi alterado, Atual:", qtdJogMult)
      }

      logreg()

      //Avisar desconexão de jogadores
      jogOnline = socket.adapter.sids.size
      console.log("SOCKET - Jogador DESCONECTOU. Quantidade de jogadores online agora: ", jogMult);
      console.log("SOCKET - Motivo Jogador DESCONECTOU: ", reason)
      console.log("SOCKET - Quem desconectou: ", socket.id)
      /* socketServer.emit('jogOnline', {jogOnline}) */
      console.log('SOCKET - Tentou avisar que jogador desconectou!')

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
      /* socketServer.emit("qtdJogadores", numberPlayers, namePlayers, nameRed, nameBlue); */

    })

  })

}


module.exports = setupSocket