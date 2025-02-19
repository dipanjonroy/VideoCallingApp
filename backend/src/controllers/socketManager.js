const { Server } = require("socket.io");

const connectToSocket = (server) => {
  return new Server(server);
};

module.exports = connectToSocket;
