// subscriber.js
import connectionManager from './connectionManager.js';

export async function startConsumer(messageHandler) {
  const queue = "user.events";
  const channelWrapper = await connectionManager.getChannel();
  const { channel } = channelWrapper;

  try {
    await channel.assertQueue(queue, { 
      durable: true 
    });

    await channel.prefetch(1);

    console.log(`Waiting for messages in ${queue}`);

    await channel.consume(queue, async (msg) => {
      if (!msg) return;

      try {
        const data = JSON.parse(msg.content.toString());
        // Process message in a non-blocking way
        setImmediate(async () => {
          try {
            await messageHandler(data);
            channel.ack(msg);
          } catch (error) {
            console.error("Error processing message:", error);
            channel.nack(msg, false, true);
          }
        });
      } catch (error) {
        console.error("Error parsing message:", error);
        channel.nack(msg, false, false);
      }
    }, { noAck: false });

  } catch (error) {
    console.error("Error setting up consumer:", error);
    connectionManager.releaseChannel(channelWrapper.channel);
    // Retry connection after delay
    setTimeout(() => startConsumer(messageHandler), 5000);
  }
}