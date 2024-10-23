// connectionManager.js
import amqp from "amqplib";

class ConnectionManager {
  constructor() {
    this.connection = null;
    this.channels = new Map();
    this.connecting = false;
    this.url = "amqp://user:password@rabbitmq-service:5672";
    this.maxChannels = 10; // Adjust based on your needs
  }

  async getConnection() {
    if (this.connection) {
      return this.connection;
    }

    if (this.connecting) {
      await new Promise(resolve => setTimeout(resolve, 100));
      return this.getConnection();
    }

    this.connecting = true;
    try {
      this.connection = await amqp.connect(this.url, {
        heartbeat: 60,
        timeout: 5000
      });

      this.connection.on("error", (err) => {
        console.error("Connection error:", err);
        this.connection = null;
        this.channels.clear();
      });

      this.connection.on("close", () => {
        console.log("Connection closed");
        this.connection = null;
        this.channels.clear();
      });

      this.connecting = false;
      return this.connection;
    } catch (error) {
      this.connecting = false;
      throw error;
    }
  }

  async getChannel() {
    const connection = await this.getConnection();
    
    // Find an available channel or create a new one
    for (const [id, channel] of this.channels.entries()) {
      if (!channel.isInUse) {
        channel.isInUse = true;
        return channel;
      }
    }

    if (this.channels.size >= this.maxChannels) {
      // Wait for an available channel
      await new Promise(resolve => setTimeout(resolve, 100));
      return this.getChannel();
    }

    const channel = await connection.createChannel();
    const channelId = this.channels.size + 1;
    this.channels.set(channelId, {
      channel,
      isInUse: true
    });

    return this.channels.get(channelId);
  }

  releaseChannel(channel) {
    for (const [id, ch] of this.channels.entries()) {
      if (ch.channel === channel) {
        ch.isInUse = false;
        break;
      }
    }
  }
}

export default new ConnectionManager();