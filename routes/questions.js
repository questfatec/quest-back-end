//Express - Serviço base
const express = require("express")
//Valor fixo 'app' para função express()
const app = express()
//HTTP
const server = require('http').Server(app)

exports.app.get('/questions', (req, res) => {
    const { MongoClient, ServerApiVersion } = require('mongodb');
    const uri = 'mongodb+srv://questgame:TSUlcLFbVFHVOrIw@questcluster.pisx8.mongodb.net/QuestDB?retryWrites=true&w=majority';
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
    client.connect(err => {
        const collection = client.db("QuestDB").collection("QuestQuestions");
        // perform actions on the collection object

    });
})

exports.app.get('/perguntas', (req,res) => {
    res.writeHead(200, {'Content-Type': 'text/html'})
    res.end('TESTE!!!')
  })