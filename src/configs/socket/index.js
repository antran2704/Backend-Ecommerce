const { Server } = require("socket.io");

const SOCKET_EVENT = {
  notification: "notification",
};

let connected = 0;

class SocketConfig {
  constructor(server) {
    this.io = new Server(server, {
      cors: {
        origin: process.env.ADMIN_ENDPOINT,
      },
    });
  }

  getSocket() {
    return this.io;
  }

  connection(socket) {
    connected++;
    console.log("new connection", connected);

    socket.on("disconnect", () => {
      connected--;
      console.log("diconnect", connected);
    });
  }
}

module.exports = { SocketConfig, SOCKET_EVENT };
