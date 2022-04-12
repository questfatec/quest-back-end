const express = require('express')
//const { restart } = require('nodemon')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const authConfig = require('../config/auth.json')

const User = require('../models/user')

const router = express.Router()

function generateToken(params = {}) {
    return jwt.sign(params, authConfig.secret, {
        expiresIn: 86400
    })
}

//CREATE
router.post('/register', async (req, res) => {
    const { email, name, password } = req.body

    try {
        if(!email) {
            res.status(401).send("Falha do Cliente: Faltou informar email do usuário")
        } else if(!name) {
            res.status(401).send("Falha do Cliente: Faltou informar o nome do usuário")
            // Falta testar se é uma categoria válida!
        } else if (!password) {
            res.status(401).send("Falha do Cliente: Faltou informar a senha")
        } else if(await User.findOne({ email }))
            return res.status(412).send({error: 'Falha - Usuário já existe com esse E-mail.Por favor informe outro e-mail.'})

        const user = await User.create(req.body)

        user.password = undefined

        return res.send( { 
            user,
            token: generateToken({ id: user.id })
        } )

    } catch (err) {
        return res.status(400).send( {error: 'Falha - Registro não realizado.'} )
    }
})


//UPDATE
router.put('/register', async (req, res) => {
    const { email, newname, oldpassword, newpassword } = await req.body

    try{
        if(!email) {
            res.status(401).send("Falha do Cliente: Faltou informar email do usuário!")
        } else if (!oldpassword) {
            res.status(401).send("Falha do Cliente: Faltou informar a senha!")
        } else if (!newpassword) {
            res.status(401).send("Falha do Cliente: Faltou informar a nova senha!")
        } else if(!await User.findOne({ email: email }))
            return res.status(412).send({error: 'Falha - Email não cadastrado!'})

        var hashpassword = await bcrypt.hash(newpassword, 10)

        var updateuser = {
            password: hashpassword,
            name: newname,
            $inc: { __v: 1}
        }

        const bduser = await User.findOne( {email} ).select('+password')

        if(!bduser) {
            return res.status(400).send({ error: 'Usuário não encontrado com base no e-mail informado.'})
        }


        const isValidPassword = await bcrypt.compare(oldpassword, bduser.password)

        if(!isValidPassword){
            return res.status(401).send({ error: 'Senha inválida'})
        } else {     

            const user = await User.findOneAndUpdate({email}, updateuser).select('+password')

            user.newpassword = undefined
            /*
            const token = jwt.sign({ id: user.id}, authConfig.secret, {
                expiresIn: 86400
            })
            */
            return res.status(200).send("Usuário atualizado com sucesso" )
            }
    } catch (err) {
        return res.status(400).send( {error: 'Falha - Usuário não pode ser atualizado.'} )
    }
})



//DELETE
router.delete('/register', async (req, res) => {
    const { email, password} = await req.body

    try{
        if(!email) {
            res.status(401).send("Falha do Cliente: Faltou informar email do usuário")
        } else if (!password) {
            res.status(401).send("Falha do Cliente: Faltou informar a senha")
        } else if(!await User.findOne({ email: email }))
            res.status(412).send({error: 'Falha - Email não cadastrado!'})
    
        const bduser = await User.findOne( {email} ).select('+password')

        if(!bduser) {
            return res.status(400).send({ error: 'Usuário não encontrado com base no e-mail informado.'})
        }

        const isValidPassword = await bcrypt.compare(password, bduser.password)

        if(!isValidPassword){
            return res.status(401).send({ error: 'Senha inválida'})
        } else {     

            const user = await User.deleteOne({email}).select('+password')
            return res.status(200).send("Usuário deletado com sucesso")
        }
    } catch (err) {
        return res.status(400).send( {error: 'Falha - Delete não realizado.'} )
    }   
})



//READ ONE
router.get('/register', async (req, res) => {
    const { email} = await req.body

    try {
        if(!email) {
            res.status(401).send("Falha do Cliente: Faltou informar email do usuário")
        } 

        const bduser = await User.findOne( {email} )

        if(!bduser) {
            return res.status(400).send({ error: 'Usuário não encontrado com base no e-mail informado.'})
        }

        res.status(200).send({ bduser})
    } catch (err) {
        return res.status(400).send( {error: 'Falha - Busca não realizada.'} )
    }
})



//READ ALL
router.get('/read', async (req, res) => {
    
    try{
        const allusers = await User.find( {} )

        res.status(200).send({ allusers})

    } catch (err) {
        return res.status(400).send( {error: 'Falha - Busca não realizada.'} )
    }
    
})


//AUTHENTICATE
router.post('/authenticate', async(req, res) => {
    const { email, password } = req.body
    
    try{
        const user = await User.findOne( { email } ).select('+password')

        if(!user) {
            return res.status(400).send({ error: 'Usuário não encontrado com base no e-mail informado.'})
        } else if(!await User.findOne({ email: email }))
            return res.status(412).send({error: 'Falha - Email não cadastrado!'})

        if(!await bcrypt.compare(password, user.password)){
            return res.status(401).send({ error: 'Senha Inválida.'})
        }

        user.password = undefined

        const token = jwt.sign({ id: user.id}, authConfig.secret, {
            expiresIn: 86400
        })

        res.status(200).send({ 
            user, 
            token: generateToken({ id: user.id })})
    } catch (err) {
        return res.status(400).send( {error: 'Falha - Authenticate não realizado.'} )
    }
})

module.exports = app => app.use('/auth', router)

