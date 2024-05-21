import amqp from "amqplib";
import { PHASE_PRODUCTION_BUILD } from "next/constants";

export const queues = {
  "webhooks:submission:submit": "webhooks:submission:submit",
  "email:submission:submit": "email:submission:submit",
  "sheets:syncAllSubmissions": "sheets:syncAllSubmissions",
  "sheets:submission:submit": "sheets:submission:submit",
  "sheets:syncNamedRanges": "sheets:syncNamedRanges",
};

const amqpConnectionSingleton = async (
  retryCount = 0
): Promise<{
  connection: amqp.Connection;
  channel: amqp.Channel;
}> => {
  if (process.env.NEXT_PHASE === PHASE_PRODUCTION_BUILD) {
    return Promise.reject();
  }

  try {
    const connection = await amqp.connect(process.env.AMQP_URL || "");

    const channel = await connection.createChannel();

    for (const queueName of Object.values(queues)) {
      console.log("Asserting queue", queueName);
      await channel.assertQueue(queueName, { durable: true });
    }

    return { connection, channel };
  } catch (error) {
    console.error("Error establishing AMQP connection", error);

    if (retryCount < 10) {
      await new Promise((resolve) => {
        const timeout = 1000 * Math.pow(2, retryCount);
        console.log("Retrying in", timeout, "ms");
        setTimeout(resolve, timeout);
      });

      return amqpConnectionSingleton(retryCount + 1);
    }

    return Promise.reject(error);
  }
};

declare global {
  var amqpConnection: undefined | ReturnType<typeof amqpConnectionSingleton>;
}

const amqpConnection = globalThis.amqpConnection ?? amqpConnectionSingleton();

globalThis.amqpConnection = amqpConnection;

export default amqpConnection;

async function publishToQueue(queue: keyof typeof queues, message: string) {
  console.log("Publishing to queue", queue, message);

  if (!globalThis.amqpConnection) {
    console.error("AMQP connection not established");
    return;
  }

  const { channel } = await globalThis.amqpConnection;
  channel.sendToQueue(queues[queue], Buffer.from(message), {
    persistent: true,
  });
}

export async function publishSubmissionToWebhooksQueue(submissionId: string) {
  await publishToQueue("webhooks:submission:submit", submissionId);
}

export async function publishSubmissionToEmailQueue(submissionId: string) {
  await publishToQueue("email:submission:submit", submissionId);
}

export async function publishSubmissionToSheetsQueue(submissionId: string) {
  await publishToQueue("sheets:submission:submit", submissionId);
}

export async function publishSheetsSyncAll(craftId: string) {
  await publishToQueue("sheets:syncAllSubmissions", craftId);
}

export async function publishSheetsSyncNamedRanges(craftId: string) {
  await publishToQueue("sheets:syncNamedRanges", craftId);
}
