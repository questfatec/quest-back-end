const express = require('express')
const router = express.Router()
const authMiddleware = require('../middlewares/auth')
const User = require('../models/user')

const Game = require('../models/game')
id = "62acb555489c4ada14c9f9dd"

router.use(authMiddleware)

//Rota para comprar ou ver situação atual VIP e cancelar.
router.get('/', async(req,res) => {
    const retorno = await Game.findOne({"_id": id})
    jogMult =  retorno.qtdJogMult,

    res.render('vip', {nomeJogador: req.session.username, vip: req.session.vip, jogMult: jogMult})
})


//Comprar Passe VIP - Registro na tabela de transações VIP e alterar no perfil do usuário
router.put('/gerenciar', async (req, res) => {
    const tsx = await req.body

    console.log("Tentativa de compra: ", tsx)

    try{

        if (!tsx) {
            
            res.status(401).send("Faltou enviar os dados do registro")            

        } else if ( !await User.findOne({ _id: tsx.idUser }) ) {

            return res.status(412).send({error: 'Falha - Email não cadastrado!'})

        } else {

            let vip = tsx.tipoTsx

            if (vip == "Compra") {
                vip = true
            } else if (vip == "Cancelamento") {
                vip = false
            }

            var updateuser = {
                VIP: vip,
                $inc: { __v: 1}
            }
    
            try {
                
                await User.findOneAndUpdate({_id: tsx.idUser}, updateuser).select('+VIP')
                
            } catch (err) {
                
                console.log("Erro ao tentar atualizar o status do jogador")

            } finally {

                console.log('Alteração do usuário realizada com sucesso.')

                res.render('prelobby', {nomeJogador: nomeJogador, vip: vip, perfil: "Jogador"})
            
            }
               
        }
           
 
    } catch (err) {

        return res.status(400).send( {error: 'Falha - Não foi possível comprar o passe VIP.'} )

    }
})


module.exports = app => app.use('/pagamento', router)