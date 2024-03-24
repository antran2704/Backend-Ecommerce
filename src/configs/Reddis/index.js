const { createClient } = require("redis");

class ReddisConnect {
  REDIS_CONNECT_TIMEOUT = 10000;
  connectionTimeout;

  async createConnect() {
    const client = createClient();
    this.handleEvent(client);
    this.handleConnect(client);
    return client;
  }

  async handleConnect(client) {
    await client.connect();
  }

  handleError(client) {
    this.connectionTimeout = setTimeout(async () => {
      await this.handleConnect(client);
    }, this.REDIS_CONNECT_TIMEOUT);
  }

  async handleEvent(client) {
    client.on("connect", () => {
      console.log("Redis Client connected");
      clearTimeout(this.connectionTimeout);
    });

    client.on("end", () => {
      console.log("Redis Client disconnected");
      this.handleError(client);
    });

    client.on("reconnecting", () => {
      console.log("Redis Client reconnecting");
    });

    client.on("error", async (err) => {
      console.log("Redis Client Error:::");
      await client.disconnect();
    });
  }
}

module.exports = ReddisConnect;
