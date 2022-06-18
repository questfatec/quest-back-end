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

console.log("Iniciando Servidor, quantidade de jogadores no Multiplayer: ", qtdJogMult)

module.exports = {
    jogOnline,
    jogMult
}