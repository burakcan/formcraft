import db from "@/services/db";
import amqpConnection, { queues } from "@/services/amqp";

async function processWebhook(submissionId: string, retryCount = 0) {
  const submission = await db.craftSubmission.findFirst({
    where: { id: submissionId },
    include: {
      craft: { include: { webhookConnection: true } },
    },
  });

  if (!submission) {
    return;
  }

  const webhook = submission.craft.webhookConnection;

  if (!webhook) {
    return;
  }

  const response = await fetch(webhook.url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-FormCraft-Signature": webhook.secret,
    },
    body: JSON.stringify(submission),
  });

  if (!response.ok && retryCount < 5) {
    await new Promise((resolve) => setTimeout(resolve, 1000 * 2 ** retryCount));
    return await processWebhook(submissionId, retryCount + 1);
  }

  if (!response.ok) {
    console.error(`Failed to send webhook for submission ${submissionId}`);
    throw new Error("Failed to send webhook");
  }

  return response;
}

async function main() {
  try {
    const { channel, connection } = await amqpConnection;

    console.log("Connection established");

    // consume messages

    await channel.consume(
      queues["webhooks:submission:submit"],
      async (message) => {
        if (!message) {
          return;
        }

        // message to string
        const submissionId = message.content.toString();

        try {
          await processWebhook(submissionId);
        } catch (error) {
          console.error("Error processing webhook", error);
        } finally {
          // acknowledge message
          channel.ack(message);
        }
      }
    );

    process.on("SIGINT", async () => {
      console.log("Closing connection");
      await connection.close();
      process.exit(0);
    });
  } catch (error) {
    console.error("Error establishing AMQP connection", error);
  }
}

main();
