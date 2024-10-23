import amqp from "amqplib";

class ConnectionManager {
  constructor() {
    this.connection = null;
    this.channels = new Map(); // Store channel and in-use status
    this.connecting = false;
    this.url = process.env.RABBITMQ_URL || "amqp://user:password@rabbitmq:5672";
    this.maxChannels = 10;
    this.maxRetries = 5;
    this.retryDelay = 5000; // 5 seconds
  }

  // Get or create a connection
  async getConnection() {
    if (this.connection) {
      return this.connection;
    }

    if (this.connecting) {
      await new Promise(resolve => setTimeout(resolve, 100));
      return this.getConnection();
    }

    this.connecting = true;
    let retries = 0;

    while (retries < this.maxRetries) {
      try {
        this.connection = await amqp.connect(this.url, {
          heartbeat: 60,
          timeout: 5000
        });

        // Handle connection error and close events
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
        console.log("Successfully connected to RabbitMQ");
        return this.connection;
      } catch (error) {
        console.error(`Failed to connect to RabbitMQ (attempt ${retries + 1}/${this.maxRetries}):`, error.message);
        retries++;
        if (retries < this.maxRetries) {
          await new Promise(resolve => setTimeout(resolve, this.retryDelay));
        }
      }
    }

    this.connecting = false;
    throw new Error(`Failed to connect to RabbitMQ after ${this.maxRetries} attempts`);
  }

  // Get an available channel, or create a new one if none are available
  async getChannel() {
    const connection = await this.getConnection();

    // Check for an available channel
    for (const [id, channelData] of this.channels.entries()) {
      if (!channelData.isInUse) {
        channelData.isInUse = true;
        return channelData.channel; // Return the actual channel
      }
    }

    // Create a new channel if none are available and the limit isn't exceeded
    if (this.channels.size < this.maxChannels) {
      const channel = await connection.createChannel();
      const channelId = this.channels.size + 1;
      this.channels.set(channelId, {
        channel,
        isInUse: true
      });

      return channel; // Return the actual channel
    }

    // If max channels are reached, wait and retry
    await new Promise(resolve => setTimeout(resolve, 100));
    return this.getChannel();
  }

  // Release a channel by marking it as not in use
  releaseChannel(channel) {
    for (const [id, channelData] of this.channels.entries()) {
      if (channelData.channel === channel) {
        channelData.isInUse = false; // Mark it as available
        return;
      }
    }

    console.warn("Attempted to release a channel that is not managed by ConnectionManager");
  }
}

export default new ConnectionManager();