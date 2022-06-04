const express = require('express')
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId
const uri = process.env.mongoDbURI
const authMiddleware = require('../middlewares/auth')

const bancodedados = 'QuestDB'
const colecao = 'QuestQuestionv2'
const colecaoCategoria = 'categories'

const router = express.Router()
router.use(authMiddleware)

//Rota para comprar créditos.
router.get('/', async(req,res) => {
    res.render('vip', {nomeJogador: req.session.username, vip: req.session.vip})
})

module.exports = app => app.use('/pagamento', router)