const { Server } = require("socket.io");

const connectToSocket = (server) => {
  const io = Server(server);

  const connections = {};
  const messages = {};
  const timeOnline = {};

  io.on("connection", (socket) => {
    socket.on("join-call", (path) => {});
  });
};

module.exports = connectToSocket;
