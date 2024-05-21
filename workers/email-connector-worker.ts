import db from "@/services/db";
import amqpConnection, { queues } from "@/services/amqp";
import { craftSubmissionEmail } from "@/services/email/craftSubmissionEmail";

async function processEmail(submissionId: string, retryCount = 0) {
  const submission = await db.craftSubmission.findFirst({
    where: { id: submissionId },
    include: {
      craft: { include: { emailConnection: true } },
    },
  });

  if (!submission) {
    return;
  }

  const emailConnection = submission.craft.emailConnection;

  if (!emailConnection) {
    return;
  }

  await craftSubmissionEmail(emailConnection.email, submission.craft);
}

async function main() {
  try {
    const { channel, connection } = await amqpConnection;

    console.log("Connection established");

    // consume messages

    await channel.consume(
      queues["email:submission:submit"],
      async (message) => {
        if (!message) {
          return;
        }

        // message to string
        const submissionId = message.content.toString();

        try {
          await processEmail(submissionId);
        } catch (error) {
          console.error("Error processing email", error);
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
