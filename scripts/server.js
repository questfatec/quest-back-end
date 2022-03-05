//Express - Serviço base
const express = require("express");

//Cookie-Parser
const cookieParser = require('cookie-parser')

//Mongoose
const mongoose = require('mongoose');

//CORS
const cors = require('cors');

//Valor fixo 'app' para função express()
const app = express();

//HTTP
const server = require('http').Server(app);

//Reconhecimento dinâmico de porta do servidor ou localhost = 3110
const PORT = process.env.PORT || 3110;
const msg_PORT = `Servidor Node.JS para QUEST FATEC disponível via porta ${PORT}!`

// Pacote Path - Para publicação
const path = require('path');

//Conexão com Banco de Dados
mongoose.connect('mongodb+srv://questgame:TSUlcLFbVFHVOrIw@questcluster.pisx8.mongodb.net/myFirstDatabase?retryWrites=true&w=majority', {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    
}, function(err) {
    if(err){
        console.log(err)
    }else{
        console.log("MongoDB Conectado e disponível para o servidor Node.JS (Quest FATEC)")
    }    
})


// hard coded configuration object
const confCors = {
 
    // origin undefined handler
    // see https://github.com/expressjs/cors/issues/71
    originUndefined: function (req, res, next) {
            next();
    },
 
    // Cross Origin Resource Sharing Options
    cors: {
        // origin handler
        origin: function (origin, cb) {
            // setup a white list
            let wl = ['*'];
            cb(null, true);
        },
        optionsSuccessStatus: 200
    }
 
};

app.use(confCors.originUndefined , cors(confCors.cors));

app.use(cookieParser())
app.use(express.json());

//Rotas
app.get('/', (req,res) => {
  res.writeHead(200, {'Content-Type': 'text/html'});
  res.end('Quest Backend conectado ao banco e online =)');
})


server.listen(PORT, () => {
  console.log(`${msg_PORT}`);
});