const { Server } = require("socket.io");

const connectToSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
      allowedHeaders: ["*"],
      credentials: true,
    }
  });

  const connectedRooms = {};
  const messages = {};
  const timeOnline = {};

  io.on("connection", (socket) => {
    socket.on("join-call", (roomID) => {
      const room = connectedRooms[roomID];
      if (room === undefined) {
        room = [];
      }
      room.push(socket.id);
      timeOnline[socket.id] = new Date();

      room.forEach((id) => {
        io.to(id).emit("user-joined", socket.id, room);
      });

      if (messages[roomID] !== undefined) {
        messages[roomID].forEach((message) => {
          io.to(message).emit(
            "chat-message",
            message["data"],
            message["sender"],
            message["socket-id-sender"]
          );
        });
      }
    });

    socket.on("send-signal", (toID, message) => {
      io.to(toID).emit("receive-signal", socket.id, message);
    });

    socket.on("chat-message", (data, sender) => {
      const [matchingRoom, found] = Object.entries(connectedRooms).reduce(
        ([room, isFound], [roomKey, roomValue]) => {
          if (!isFound && roomValue.includes(socket.id)) {
            return [roomKey, true];
          } else {
            [room, isFound];
          }
        },
        [", false"]
      );

      if (found) {
        if (messages[matchingRoom] === undefined) {
          messages[matchingRoom] = [];
        }

        messages[matchingRoom].push({
          data,
          sender,
          "socket-id-sender": socket.id,
        });

        connectedRooms[matchingRoom].forEach((id)=>{
          io.to(id).emit("chat-message", data, sender, socket.id);
        })
      }
    });

    socket.on("disconnect", ()=>{
      const diffTime = new Date() - timeOnline[socket.id];
      
      let key;

      for(const [k,v] of JSON.parse(JSON.stringify(Object.entries(connectedRooms)))){
        v.forEach((id)=>{
          if (v === socket.id){
            key = k;
          }

          connectedRooms[key].forEach((id)=>{
            io.to(id).emit("user-left", socket.id)
          })
        })
      }

      const index = connectedRooms[key].indexOf(socket.id);
      connectedRooms[key].splice(index,1);

      if(connectedRooms[key].length === 0){
        delete connectedRooms[key]
      }
    })
  });
};

module.exports = connectToSocket;
