//Importar biblioteca Express
const express = require('express')
const bodyParser = require('body-parser')
const sessions = require('express-session');

//Para usar bibilioteca Express
const app = express()

const http = require('http').createServer(app);

//Para entender arquivos JSON  
app.use(bodyParser.json())

//Para o servidor entender/decodar quando parâmetros forem passados pela URL
app.use(bodyParser.urlencoded( {extended: false} ))

//Cookie-Parser
const cookieParser = require('cookie-parser')

//CORS
const cors = require('cors')

//Reconhecimento dinâmico de porta do servidor ou localhost = 5000
const PORT = process.env.PORT || 4202
const msg_PORT = `Servidor Node.JS para QUEST FATEC disponível via porta ${PORT}!`

http.listen(PORT, () => {
  console.log(`${msg_PORT}`)
});

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
app.use('/audio', express.static(__dirname + 'public/audio'))
app.use('/css', express.static(__dirname + 'public/css'))
app.use('/src', express.static(__dirname + 'public/src'))
app.use('/src/game', express.static(__dirname + 'public/src/game'))
app.use('/img', express.static(__dirname + 'public/img'))

// Definição das variáveis para criar a DOM para o JQuery funcionar com o EJS
var jsdom = require("jsdom");
const { JSDOM } = jsdom;
const { window } = new JSDOM();
const { document } = (new JSDOM('')).window;
global.document = document;

//Socket - Tabuleiro
require("./socket/startM")(http)

//nova rota para jogo multiplayer
require('./controller/gameController')(app)

//rotas antigas, porém ainda usando
require('./controller/authController')(app)
require('./controller/categoryController')(app)
require('./controller/questionControllerV3')(app)
require('./controller/paymentController')(app)


//Criar a rota principal
app.get('/login', (req, res) => {
    res.render('login');
});

app.get('/auth/new', (req, res) => {
    res.render('novologin');
});

app.get('/regras', (req, res) => {
    res.render('regras');
});

app.get('/', (req, res) => {
    res.render('loginNovo');
});