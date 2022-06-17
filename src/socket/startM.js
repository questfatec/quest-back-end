const io = require("socket.io");
let {
  jogOnline,
  jogMult
} = require('./constants')

function setupSocket(http) {

  const socketServer = io(http)

  socketServer.on("connection", (socket) => {
    //console.log("Conexão Socket Ativa - ID:", socket.id)
    //socket.adapter.sids.size

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


    socket.on("disconnect", (reason) => {
      //Avisar desconexão de jogadores
      jogOnline = socket.adapter.sids.size
      //console.log("Jogador DESCONECTOU. Quantidade de jogadores online agora: ", jogMult);
      //console.log("Motivo Jogador DESCONECTOU: ", reason)
      //console.log("Quem desconectou: ", socket.id)
      socketServer.emit('jogOnline', {jogOnline})
    })

  })

}





module.exports = setupSocket