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
    console.log("Novo jogador CONECTOU. Quantidade de jogadores online agora: ", jogOnline);
    socketServer.emit('jogOnline', {jogOnline})

    //Receber info de Jogador entrou no Multiplayer
    socket.on('jogMultOn', () => {
      jogMult ++
      console.log("Novo jogador ENTROU NO MULTIPLAYER. Quantidade de jogadores no multiplayer agora: ", jogMult);
      socketServer.emit('jogMult', {jogMult})
    })


    socket.on("disconnect", (reason) => {
      //Avisar desconexão de jogadores
      jogOnline--
      console.log("Jogador DESCONECTOU. Quantidade de jogadores online agora: ", jogMult);
      console.log("Motivo Jogador DESCONECTOU: ", reason)
      socketServer.emit('jogOnline', {jogOnline})
    })

  })

}





module.exports = setupSocket