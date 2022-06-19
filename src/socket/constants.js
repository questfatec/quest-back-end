var jogOnline = 0
console.log("Iniciando Servidor, quantidade de jogadores Online: ", jogOnline)

/* async function buscaQtdJogMult() {
    try {
        const Game = require('../models/game')
        id = "62acb555489c4ada14c9f9dd"
        const retorno = await Game.findOne({"_id": id})
        return retorno.qtdJogMult
    } catch(err) {
        console.log("erro")
    }

    console.log("fim busca")
}

let qtdJogMultDB = buscaQtdJogMult() */

var jogMult = []
var qtdJogMult = jogMult.length

//console.log("Iniciando Servidor, quantidade de jogadores no Multiplayer: ", qtdJogMult)


///// PARTE PARA TABULEIRO

const gameTable = {
    casas: [
      "início",
      "M",
      "S",
      "E",
      "CT",
      "AE",
      "V",
      "E",
      "S",
      "M",
      "CT",
      "S",
      "V",
      "M",
      "AE",
      "E",
      "M",
      "AE",
      "V",
      "S",
      "CT",
      "E",
      "M",
      "AE",
      "V",
      "M",
      "S",
      "E",
      "CT",
      "fim",
    ],
    cores: {
      início: "#19af54",
      M: "#fd8f36",
      S: "#a745fb",
      E: "#8afd40",
      CT: "#31a6fc",
      AE: "#fc2c32",
      V: "#fcfd45",
      fim: "#19af54",
    },
    categoriaAtual: [
      "Início",
      "Mundo",
      "Sociedade",
      "Esportes",
      "Ciência e Tecnologia",
      "Artes e Entretenimento",
      "Variedades",
      "Esportes",
      "Sociedade",
      "Mundo",
      "Ciência e Tecnologia",
      "Sociedade",
      "Variedades",
      "Mundo",
      "Artes e Entretenimento",
      "Esportes",
      "Mundo",
      "Artes e Entretenimento",
      "Variedades",
      "Sociedade",
      "Ciência e Tecnologia",
      "Esportes",
      "Mundo",
      "Artes e Entretenimento",
      "Variedades",
      "Mundo",
      "Sociedade",
      "Esportes",
      "Ciência e Tecnologia",
      "fim",
    ],
  };
  
  var numberPlayers = 0;
  var socketRed;
  var socketBlue;
  var namePlayers = []
  var nameRed;
  var nameBlue;
  
  var gameState = {
    posicaoRed: 0,
    posicaoBlue: 0,
    fichasRed: [true, true, true, true, true],
    fichasblue: [true, true, true, true, true],
  };

module.exports = {
    jogOnline,
    jogMult,
    gameTable,
    numberPlayers,
    socketRed,
    socketBlue,
    namePlayers,
    nameRed,
    nameBlue,
    gameState,
}