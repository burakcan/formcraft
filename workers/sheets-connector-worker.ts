import amqp from "amqplib";
import {
  appendSingleAnswer,
  syncAllAnswers,
  syncNamedRanges,
} from "@/services/sheetsConnector";
import amqpConnection, { queues } from "@/services/amqp";
import db from "@/services/db";

async function processSubmission(submissionId: string) {
  const submission = await db.craftSubmission.findFirst({
    where: { id: submissionId },
  });

  if (!submission) {
    return;
  }

  await appendSingleAnswer(submission.craftId, submission.id);
}

async function processInitialConnection(craftId: string) {
  await syncAllAnswers(craftId);
}

async function processSyncNamedRanges(craftId: string) {
  await syncNamedRanges(craftId);
}

async function listenSubmissions(channel: amqp.Channel) {
  try {
    await channel.consume(
      queues["sheets:submission:submit"],
      async (message) => {
        if (!message) {
          return;
        }

        // message to string
        const submissionId = message.content.toString();

        try {
          await processSubmission(submissionId);
        } catch (error) {
          console.error("Error processing sheets message", error);
        } finally {
          // acknowledge message
          channel.ack(message);
        }
      }
    );
  } catch (error) {
    console.error("Error consuming submissions", error);
  }
}

async function listenInitialConnection(channel: amqp.Channel) {
  try {
    await channel.consume(
      queues["sheets:syncAllSubmissions"],
      async (message) => {
        if (!message) {
          return;
        }

        // message to string
        const craftId = message.content.toString();

        try {
          await processInitialConnection(craftId);
        } catch (error) {
          console.error("Error processing sheets message", error);
        } finally {
          // acknowledge message
          channel.ack(message);
        }
      }
    );
  } catch (error) {
    console.error("Error consuming submissions", error);
  }
}

async function listenSyncNamedRanges(channel: amqp.Channel) {
  try {
    await channel.consume(queues["sheets:syncNamedRanges"], async (message) => {
      if (!message) {
        return;
      }

      // message to string
      const craftId = message.content.toString();

      try {
        await processSyncNamedRanges(craftId);
      } catch (error) {
        console.error("Error processing sheets message", error);
      } finally {
        // acknowledge message
        channel.ack(message);
      }
    });
  } catch (error) {
    console.error("Error consuming submissions", error);
  }
}

async function main() {
  try {
    const { connection, channel } = await amqpConnection;

    await channel.assertQueue(queues["sheets:syncAllSubmissions"], {
      durable: true,
    });

    await channel.assertQueue(queues["sheets:submission:submit"], {
      durable: true,
    });

    await Promise.all([
      listenInitialConnection(channel),
      listenSubmissions(channel),
      listenSyncNamedRanges(channel),
    ]);

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
