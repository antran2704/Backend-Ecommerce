const { Server } = require("socket.io");

const SOCKET_EVENT = {
  notification: "notification",
};

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
    console.log("new connection");

    socket.on("disconnect", () => {
      console.log("diconnect");
    });
  }
}

module.exports = { SocketConfig, SOCKET_EVENT };
