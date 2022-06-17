const express = require('express')
const authMiddleware = require('../middlewares/auth')
const Game = require('../models/game')

const router = express.Router()
router.use(authMiddleware)

//lobby
router.get('/', async (req, res) => {
    res.render('loadmultiplayer')
})

router.get('/ready', async (req, res) => {
    res.render('a')
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


module.exports = app => app.use('/game', router)