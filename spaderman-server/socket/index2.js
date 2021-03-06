const socketIo = require("socket.io");
let usersConnected = [];
let usersBuffer = [];

module.exports = function initSocket(server) {
  const io = socketIo(server, {
    cors: {
      origin: "https://spaderman.herokuapp.com",
      methods: ["GET", "POST"],
    },
  });

  /**
   *
   * Listening and emiting with Io io
   */

  io.on("connection", (socket) => {
    console.log("New client connected");

    usersConnected.push(socket.id);
    console.log(usersConnected);

    socket.on("new-user", (room,username) => {
      socket.join(room);
      
      socket.to(room).emit("incomingUser",username)
      console.log("the user is", socket.id, "jas joined", room);
    });
    socket.on("sendStartSignal", (room) => {
      
      io.to(room).emit("startSignal");
    });

    socket.on("newuser-refresh", (room,username)=>{
      console.log("recuuuuuuu");
      socket.to(room).emit("incomingUser",username)
    }
    )

    socket.on("playerMoving", (myXPosition, myYPosition, room) => {
      socket
        .to(room)
        .emit("trackMovement", myXPosition, myYPosition, socket.id);
    });

    socket.on("digBoard", (room, boardGame) => {
      socket.to(room).emit("refreshBoard", boardGame);
    });

    socket.on("transferScore", (room, myScore) => {
      socket.to(room).emit("otherPlayerScore", { myScore, id: socket.id });
    });
    socket.on("transferBomb", (room, myBomb) => {
      socket.to(room).emit("otherPlayerBomb", { myBomb, id: socket.id });
    });

    socket.on("sendStunned", (room, message) => {
      socket.to(room).emit("Stunned", message);
    });
    socket.on("closeRoom", () => {
      
      io.emit("refreshRooms");
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected");
      usersBuffer = usersConnected;
      usersConnected = usersBuffer.filter((id) => {
        return id !== socket.id;
      });
      console.log(usersConnected);
    });
  });
};
