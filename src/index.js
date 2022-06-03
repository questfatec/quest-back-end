//Importar biblioteca Express
const express = require('express')
const bodyParser = require('body-parser')
const sessions = require('express-session');
var session

//Para usar bibilioteca Express
const app = express()

const http = require('http').createServer(app);
const io = require('socket.io')(http);

//Para entender arquivos JSON  
app.use(bodyParser.json())

//Para o servidor entender/decodar quando parâmetros forem passados pela URL
app.use(bodyParser.urlencoded( {extended: false} ))

//Cookie-Parser
const cookieParser = require('cookie-parser')

//MongoClient
const MongoClient = require('mongodb').MongoClient;

// Pacote Path - Para publicação
const path = require('path');

//ObjectID ajuda no controle das chaves de identificação
const { ObjectId } = require("mongodb");

const { stringify } = require("querystring");0

//CORS
const cors = require('cors')

//Reconhecimento dinâmico de porta do servidor ou localhost = 5000
const PORT = process.env.PORT || 4202
const msg_PORT = `Servidor Node.JS para QUEST FATEC disponível via porta ${PORT}!`

app.use(sessions({
    secret: "perauvamacaosaladaMista*$¨#$@$#@%@$#&*#¨%¨#thisismysecrctekabobraseyfhrgfgrfrty84fwir767",
    saveUninitialized:true,
    cookie: { maxAge: 1000 * 60 * 60 * 24 },
    resave: false
}));

// hard coded configuration object
const confCors = {
 
    // origin undefined handler
    // see https://github.com/expressjs/cors/issues/71
    originUndefined: function (req, res, next) {
        res.setHeader('Access-Control-Allow-Credentials', true);
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

const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('../swagger/novoswagger.json');

//app.use('/swagger', express.static('swagger'));
app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Define a View Engine como EJS
app.set('view engine', 'ejs');
app.set('views', './views'); 
//console.log("EJS engine view: OK.")

// Static Files
app.use(express.static('public'))
app.use('/css', express.static(__dirname + 'public/css'))
app.use('/src', express.static(__dirname + 'public/src'))

// Definição das variáveis para criar a DOM para o JQuery funcionar com o EJS
var jsdom = require("jsdom");
const { JSDOM } = jsdom;
const { window } = new JSDOM();
const { document } = (new JSDOM('')).window;
global.document = document;

require('./controller/authController')(app)
require('./controller/categoryController')(app)
require('./controller/questionControllerV3')(app)
require('./controller/paymentController')(app)

//Criar a rota principal
app.get('/', (req, res) => {
    res.render('login');
});

app.get('/auth/new', (req, res) => {
    res.render('novologin');
});

app.get('/regras', (req, res) => {
    res.render('regras');
});

http.listen(PORT, () => {
    console.log(`${msg_PORT}`)
});

const gameTable = {
    casas:
      ['início',
        'M', 'S', 'E', 'CT',
        'AE', 'V', 'E', 'S',
        'M', 'CT', 'S', 'V',
        'M', 'AE', 'E', 'M',
        'AE', 'V', 'S', 'CT',
        'E', 'M', 'AE', 'V',
        'M', 'S', 'E', 'CT',
        'fim'],
    cores: {'início': '#19af54',
          'M': '#fd8f36',
          'S': '#a745fb',
          'E': '#8afd40',
          'CT': '#31a6fc',
          'AE': '#fc2c32',
          'V': '#fcfd45',
          'fim': '#19af54'}
}

var numberPlayers = 0;
var socketRed;
var socketBlue;
var gameState = {
    posicaoRed: 0,
    posicaoBlue: 0,
    fichasRed: [true, true, true, true, true],
    fichasblue: [true, true, true, true, true]
};

io.on('connection', (socket) => {
    io.emit('gameTable', gameTable);
    io.emit('gameState', gameState);
    console.log('new connection', socket.id);
    msgRetorno = startPlayer( socket.id);
    io.emit('chat message', 'new player ' + numberPlayers + ' ' + msgRetorno);
    console.log('new player ' + numberPlayers);
    socket.on('disconnect', () => {
        
        if (socket.id=socketRed) {
            console.log('player red disconnected');
        } else if (socket.id=socketBlue) {
            console.log('player blue disconnected');
        } else {
            console.log('user ' + socket.id + ' disconnected');
        }
        numberPlayers -= 1;
    })
    socket.on('chat message', (msg) => {
        io.emit('chat message', msg);
    })

    socket.on('moveRed', (casa) => {
        io.emit('moveRed', casa);
    })
})

function startPlayer(socketId) {
    numberPlayers += 1;
    if (numberPlayers==1){
        socketRed=socketId;
        return 'Jogador Vermelho';
    } else if (numberPlayers==2){
        socketBlue=socketId;
        return 'Jogador Azul';
    } else {
        return 'Observador';
    }
}
