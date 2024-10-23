// publisher.js
import connectionManager from './connectionManager.js';

export async function publishMessage(messageData) {
  const queue = "user.events";
  const channelWrapper = await connectionManager.getChannel();
  
  try {
    const { channel } = channelWrapper;
    await channel.assertQueue(queue, { 
      durable: true 
    });

    const message = Buffer.from(JSON.stringify(messageData));
    await channel.sendToQueue(queue, message, {
      persistent: true
    });

  } catch (error) {
    console.error("Error publishing message:", error);
    throw error;
  } finally {
    connectionManager.releaseChannel(channelWrapper.channel);
  }
}