const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const io = require("socket.io")(server);

app.get("/pretas", (req, res) => {
  res.sendFile(__dirname + "/pretas.html");
});
app.get("/brancas", (req, res) => {
  res.sendFile(__dirname + "/brancas.html");
});
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});
// Matriz da posição do tabuleiro
var board = [
  [0, 1, 0, 1, 0, 1, 0, 1],
  [1, 0, 1, 0, 1, 0, 1, 0],
  [0, 1, 0, 1, 0, 1, 0, 1],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [2, 0, 2, 0, 2, 0, 2, 0],
  [0, 2, 0, 2, 0, 2, 0, 2],
  [2, 0, 2, 0, 2, 0, 2, 0],
];

// Vez do jogador
var vez = 2;

// Quando um cliente se conecta
io.on("connection", function (socket) {
  console.log("Novo cliente conectado");

  // Envia a matriz da posição do tabuleiro para o cliente
  socket.emit("board", board);
  // envia a vez do jogador para o cliente
  socket.emit("vez", vez);

  // Quando a matriz da posição do tabuleiro é recebida do cliente
  socket.on("board", function (newBoard) {
    board = newBoard;
    console.log(newBoard);
    // Envia a matriz da posição do tabuleiro para todos os clientes
    io.emit("board", board);
  });

  // recebe a vez do jogador
  socket.on("vez", function (newVez) {
    vez = newVez;
    console.log(newVez);
    // Envia a vez do jogador para todos os clientes
    io.emit("vez", vez);
  });

  // Quando a conexão com o cliente é fechada
  socket.on("disconnect", function () {
    console.log("Cliente desconectado");
  });

  // quando o cliente mandar reiniciar o jogo reinicia a matriz da posição do tabuleiro
  socket.on("reiniciar", function () {
    board = [
      [0, 1, 0, 1, 0, 1, 0, 1],
      [1, 0, 1, 0, 1, 0, 1, 0],
      [0, 1, 0, 1, 0, 1, 0, 1],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [2, 0, 2, 0, 2, 0, 2, 0],
      [0, 2, 0, 2, 0, 2, 0, 2],
      [2, 0, 2, 0, 2, 0, 2, 0],
    ];
    vez = 2;
    io.emit("board", board);
    io.emit("vez", vez);
    io.emit("reiniciar");
  });
});

// Inicia o servidor na porta 3000
server.listen(3000, function () {
  console.log("Servidor rodando na porta 3000");
});
