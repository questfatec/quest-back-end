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


async function logreg(req, res, status) {
    
    try {
        const retorno = await Game.updateOne({"_id": id}, {$inc: { qtdJogMult: status}})
        console.log("Quantidade de Jogadores no Multiplayer foi alterado, Atual:", retorno.qtdJogOnline)
        return res.send(retorno)

    } catch (err) {
        return res.status(400).send( {error: 'Falha - alteração na quantidade de jogadores não realizada: ', err} )
    }
}

//REGISTRA LOGIN
router.put('/login', async (req, res) => {
    const retorno = await Game.findOne({"_id": id})
    qtdJogMult = retorno.qtdJogMult
    //console.log("Quantidade de Jogadores Multiplayer agora: ", qtdJogMult)
    
    if(qtdJogMult < 2  && qtdJogMult >= 0) {
        console.log("iniciando teste: ", qtdJogMult)
        if (qtdJogMult = 0) {
            //rotina login player red
            try{
                await logreg(req, res, 1)
            } catch (err) {
                return res.sendStatus(421)
            }
        } else if (qtdJogMult = 1) {
            // rotina login player blue
            try{
                await logreg(req, res, 1)
            } catch (err) {
                return res.sendStatus(421)
            }
        } else {
            msg = "erro ao tentar iniciar um jogador - já existem 2 online!"
            console.log(msg)
            return res.status(421).send(msg)
        }
    } else {
        //erro - mais que três jogadores!
        console.log("erro ao tentar iniciar um jogador - já existem 2 online!")
        return res.sendStatus(400)
    }
})

//REGISTRA LOGOUT
router.put('/logout', async (req, res) => {
    logreg(req, res, -1)
})



module.exports = app => app.use('/game', router)