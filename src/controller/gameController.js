const express = require('express')
const authMiddleware = require('../middlewares/auth')
const Game = require('../models/game')
id = "62acb555489c4ada14c9f9dd"

const router = express.Router()
router.use(authMiddleware)

//lobby
router.get('/', async (req, res) => {
    res.render('loadmultiplayer')
})

//pós-lobby -> Tabuleiro e Perguntas
router.get('/multiplayer', async (req, res) => {

    const retorno = await Game.findOne({"_id": id})

    jogMult =  retorno.qtdJogMult,
 
    playerRedId = retorno.playerRedId
	playerRedName = retorno.playerRedName
	playerRedPosition = retorno.playerRedPosition
    playerRedFirstCategory = retorno.playerRedFirstCategory

	playerBlueId = retorno.playerBlueId
	playerBlueName = retorno.playerBlueName
	playerBluePosition = retorno.playerBluePosition
    playerBlueFirstCategory = retorno.playerBlueFirstCategory

    console.log("teste req.session: ", req.session )

    let estado = {
        qtdJogadores: 0, 

        nomeJogador: req.session.username,
        categoriaInicial: "PENDENTE FRONT",

        jogMult: jogMult,

        playerRedId : playerRedId,
        playerRedName : playerRedName,
        playerRedPosition : playerRedPosition,
        playerRedFirstCategory : playerRedFirstCategory,

        playerBlueId : playerBlueId,
	    playerBlueName : playerBlueName,
	    playerBluePosition : playerBluePosition,
        playerBlueFirstCategory : playerBlueFirstCategory,

        currentTurn : retorno.currentTurn
    }
	

    res.render('multiplayer', {estado})
})

//READ ALL
router.get('/list', async (req, res) => {
    try {
        const allgames = await Game.find({})
        return res.send(allgames)
    } catch (err) {
        return res.status(400).send( {error: 'Falha - Leitura não realizada.'} )
    }
})

//REGISTER GAME
router.post('/register', async (req, res) => {

/*     if(!req.body.playerRedId || !req.body.playerBlueId) {
        return res.status(401).send({error: 'Falha - Falta o ID do Jogador Azul!'})
    } else { */
        try {
            const retorno = await Game.create(req.body)
            console.log("Jogo Multiplayer registrado")
            return res.send(retorno)

        } catch (err) {
            return res.status(400).send( {error: 'Falha - Gravação não realizada: ', err} )
        }
    // }
})

//DELETE GAME
router.delete('/register', async (req, res) => {

    /*     if(!req.body.playerRedId || !req.body.playerBlueId) {
            return res.status(401).send({error: 'Falha - Falta o ID do Jogador Azul!'})
        } else { */
            try {
                const retorno = await Game.deleteOne({"_id": req.body._id})
                console.log("Jogo deletado")
                return res.send(retorno)
    
            } catch (err) {
                return res.status(400).send( {error: 'Falha - Jogo não deletado: ', err} )
            }
        // }
    })

//Função para buscar hora atual
var dataagora = new Date()

function ajustaDataHoraParaBrasil() {
    var dataISO = dataagora.toISOString();
    var dataAno = dataISO.substr(0, 4);
    var dataMes = dataISO.substr(5, 2) - 1;
    var dataDia = dataISO.substr(8, 2);
    var dataHoraBR = dataISO.substr(11, 2) - 6;
    var dataMinBR = dataISO.substr(14, 2);
    var dataBR = new Date(dataAno, dataMes, dataDia, dataHoraBR, dataMinBR, 0, 0);
    return dataBR;
}

//Logar hora atual do Brasil quando o servidor for reiniciado
var dataBR = ajustaDataHoraParaBrasil();
console.log("Data Agora(Brasil): ", dataBR)



//Função para registrar entrada ou saída do multiplayer
async function logreg(req, res, status, corPeao) {
    
    let pedido = req.body 
    console.log("Pedido de alteração de Jogador...")

    const horaAgora = ajustaDataHoraParaBrasil()

    //Determinar se o jogador é Vermelho ou Azul
    if (corPeao == 'red') {
        console.log("Iniciando registro de Jogador Vermelho - logreg...")
        
        try {
        
            await Game.updateOne(
                { "_id" : id } ,
                { "$set" : { 
                    "playerRedId": pedido.playerId,
                    "playerRedName": pedido.playerName,
                    "playerRedPosition": 0,
                    "playerRedConnectedAt": horaAgora,
                    "playerRedFirstCategory": pedido.playerFirstCategory,
                    "lastUpdate": horaAgora
                }
            })

            await Game.updateOne({"_id": id}, {$inc: { qtdJogMult: status}})
    
            const retorno = await Game.findOne({"_id": id})
            qtdJogMult = retorno.qtdJogMult
            console.log("Quantidade de Jogadores no Multiplayer foi alterado, Atual:", qtdJogMult)
            console.log("Jogador ",corPeao," Registrado!!!")
            return res.send({retorno, corPeao})

        } catch (err) {
            return res.status(400).send( {error: 'Falha - alteração na quantidade de jogadores não realizada: ', err} )
        } 

    } else if (corPeao == 'blue') {

        console.log("Iniciando registro de Jogador Azul - logreg...")

        try {
        
            await Game.updateOne(
                { "_id" : id } ,
                { "$set" : { 
                    "playerBlueId": pedido.playerId,
                    "playerBlueName": pedido.playerName,
                    "playerBluePosition": 0,
                    "playerBlueConnectedAt": horaAgora,
                    "playerBlueFirstCategory": pedido.playerFirstCategory,
                    "lastUpdate": horaAgora
                }
            })

            await Game.updateOne({"_id": id}, {$inc: { qtdJogMult: status}})
    
            const retorno = await Game.findOne({"_id": id})
            qtdJogMult = retorno.qtdJogMult
            console.log("Quantidade de Jogadores no Multiplayer foi alterado, Atual:", qtdJogMult)
            console.log("Jogador ",corPeao," Registrado!!!")
            return res.send({retorno, corPeao})
        } catch (err) {
            return res.status(400).send( {error: 'Falha - alteração na quantidade de jogadores não realizada: ', err} )
        } 

    } else if (corPeao == 'apagaTudo') {

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
        console.log("Quantidade de Jogadores no Multiplayer foi alterado, Atual:", qtdJogMult)
        return res.send(retorno)

    } else {
        console.log("erro na hora de determinar a cor do peão.")
        return res.status(400).send( {error: 'Falha - erro na hora de determinar a cor do peão.'} )
    }
 
}

//REGISTRA LOGIN
router.put('/login', async (req, res) => {
    console.log("Iniciando login...: ", req.body)

    const retorno = await Game.findOne({"_id": id})
    qtdJogMult = retorno.qtdJogMult
    console.log("Quantidade de Jogadores Multiplayer agora: ", qtdJogMult)
    
    if(qtdJogMult == 0  || qtdJogMult == 1) {
        console.log("iniciando teste para verificar se sala não está lotada: ", qtdJogMult)
        if (qtdJogMult == 0) {
            console.log("Iniciando rotina para Jogador Vermelho - Início")
            //rotina login player red
            try{
                await logreg(req, res, 1, 'red')
            } catch (err) {
                return res.sendStatus(421)
            }
        } else {
            console.log("Iniciando rotina para Jogador Azul - Início")
            // rotina login player blue
            try{
                await logreg(req, res, 1, 'blue')
            } catch (err) {
                return res.sendStatus(421)
            }
        }
    } else {
        //erro - mais que três jogadores!
        console.log("erro ao tentar iniciar um jogador - já existem 2 online!")
        return res.sendStatus(400)
    }
})

//REGISTRA LOGOUT
router.put('/logout', async (req, res) => {
    console.log("Iniciando logout...: ", req.body)

    const retorno = await Game.findOne({"_id": id})
    qtdJogMult = retorno.qtdJogMult
    console.log("Quantidade de Jogadores Multiplayer agora - LOGOUT: ", qtdJogMult)
    
    if(qtdJogMult == 2 || qtdJogMult == 1) {
        console.log("iniciando teste para verificar se pode remover: ", qtdJogMult)
        //Falta identificar quem está saindo (vermelho ou azul?)
        if (qtdJogMult == 1) {

            //rotina logout player red
            try{
                await logreg(req, res, -1)
            } catch (err) {
                return res.sendStatus(421)
            }
        } else if (qtdJogMult == 2) {
            // rotina login player blue
            try{
                await logreg(req, res, -1)
            } catch (err) {
                return res.sendStatus(421)
            }
        } else {
            msg = "erro ao tentar remover um jogador - Por favor verifique a quantidade de jogadores multiplayer e tente novamente."
            console.log(msg)
            return res.status(421).send(msg)
        }
    } else {
        //erro - mais que três jogadores!
        console.log("erro ao tentar iniciar um jogador - Quantidade de jogadores menor que 1 ou maior que 2")
        return res.sendStatus(400)
    }
})


//LIMPA JOGADORES LOGADOR -  PARA DESENVOLVIMENTO / MANUTENÇÃO
router.put('/alterar', async(req, res) => {
    await logreg(req, res, -1, "apagaTudo")
})


module.exports = app => app.use('/game', router)