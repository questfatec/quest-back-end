const { ObjectId } = require('mongodb')
const mongoose = require('../database')

const GameSchema = new mongoose.Schema({
    playerRedId:{
        type: String,
    },
    playerRedName:{
        type: String,
    },
    playerRedPosition:{
        type: Number,
    },
    playerRedConnectedAt:{
        type: Date,
    },
    playerBlueId:{
        type: String,
    },
    playerBlueName:{
        type: String,
    },
    playerBluePosition:{
        type: Number,
    },
    playerBlueConnectedAt:{
        type: Date,
    },
    gameStartedAt:{
        type: Date,
    },
    gamefinishedAt:{
        type: Date,
        required: false,
    },
    lastUpdate:{
        type: Date,
        required: false,
    },
    currentTurn:{
        type: String,
        required: false,
    },
    __v:{
        type: Number,
        default: 0,
    }
})

const Game = mongoose.model('Game', GameSchema)

module.exports = Game