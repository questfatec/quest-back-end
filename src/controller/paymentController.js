const User = require('../models/user')
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

//Rota para ver situação atual VIP, comprar ou cancelar.
router.get('/', async(req,res) => {
    res.render('vip', {nomeJogador: req.session.username, vip: req.session.vip})
})

//Comprar Passe VIP - Registro na tabela de transações VIP e alterar no perfil do usuário
router.put('/comprar', async (req, res) => {
    const { regCompra } = await req.body

    try{

        if (!reqCompra) {
            
            res.status(401).send("Faltou enviar os dados do registro")

        } else if ( !await User.findOne({ _id: req.body.idUser }) )
           
            return res.status(412).send({error: 'Falha - Email não cadastrado!'})

        var updateuser = {
            vip: true,
            $inc: { __v: 1}
        }

         await User.findOneAndUpdate({_id: req.body.idUser}, updateuser).select('+vip')

        return res.status(200).send("Usuário atualizado com sucesso - agora é VIP!" )
            
    } catch (err) {
        return res.status(400).send( {error: 'Falha - Não foi possível comprar o passe VIP.'} )
    }
})


module.exports = app => app.use('/pagamento', router)