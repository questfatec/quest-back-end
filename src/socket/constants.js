const gameTable = {
  casas: [
    "início",
    "M",
    "S",
    "E",
    "CT",
    "AE",
    "V",
    "E",
    "S",
    "M",
    "CT",
    "S",
    "V",
    "M",
    "AE",
    "E",
    "M",
    "AE",
    "V",
    "S",
    "CT",
    "E",
    "M",
    "AE",
    "V",
    "M",
    "S",
    "E",
    "CT",
    "fim",
  ],
  cores: {
    início: "#19af54",
    M: "#fd8f36",
    S: "#a745fb",
    E: "#8afd40",
    CT: "#31a6fc",
    AE: "#fc2c32",
    V: "#fcfd45",
    fim: "#19af54",
  },
};

var numberPlayers = 0;
var socketRed;
var socketBlue;

var gameState = {
  posicaoRed: 0,
  posicaoBlue: 0,
  fichasRed: [true, true, true, true, true],
  fichasblue: [true, true, true, true, true],
};

module.exports = {
  gameTable,
  numberPlayers,
  socketRed,
  socketBlue,
  gameState,
};
