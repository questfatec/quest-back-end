//Express - Serviço base
const express = require("express")

//Valor fixo 'app' para função express()
const app = express()

//Body Parser
const bodyParser = require('body-parser')

//HTTP
const server = require('http').Server(app)

//Cookie-Parser
const cookieParser = require('cookie-parser')

//CORS
const cors = require('cors')

//Reconhecimento dinâmico de porta do servidor ou localhost = 5000
const PORT = process.env.PORT || 5000
const msg_PORT = `Servidor Node.JS para QUEST FATEC disponível via porta ${PORT}!`

// Pacote Path - Para publicação
const path = require('path')

// hard coded configuration object
const confCors = {
 
    // origin undefined handler
    // see https://github.com/expressjs/cors/issues/71
    originUndefined: function (req, res, next) {
            next()
    },
 
    // Cross Origin Resource Sharing Options
    cors: {
        // origin handler
        origin: function (origin, cb) {
            // setup a white list
            let wl = ['*']
            cb(null, true)
        },
        optionsSuccessStatus: 200
    }
}

app.use(confCors.originUndefined , cors(confCors.cors))

app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({ extended: false}))

//Rota Base
app.get('/', (req,res) => {
  res.writeHead(200, {'Content-Type': 'text/html'})
  res.end('Bem Vindo ao Quest - Backend conectado ao banco e online =)')
})

const uri = process.env.mongoDbURI

app.get('/perguntas', (req,res)=>{

    categoria = req.body.categoria

    const busca = { categoria: categoria}

    const MongoClient = require('mongodb').MongoClient;

    MongoClient.connect(uri, { useUnifiedTopology: true }, function (err, QuestDB) {
        if (err) throw err;
        var dbo = QuestDB.db("QuestDB");
        dbo.collection("QuestQuestions").find(busca).toArray(function (err, questions) {
            if (err) throw err;
            res.send(questions)
            QuestDB.close(); 
        })
    })
})

server.listen(PORT, () => {
  console.log(`${msg_PORT}`)
});