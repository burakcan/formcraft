import type { Craft } from "@prisma/client";
import { sendMail } from ".";

export const craftSubmissionEmail = async (email: string, craft: Craft) => {
  const subject = `Formcraft - New submission received to ${craft.title}`;

  const text = `
    Hi there!
    You have received a new submission to your form ${craft.title}.

    To view the submission, click the following link:
    ${process.env.NEXT_PUBLIC_URL}/form/${craft.id}/results
  `;

  const html = `
    <p>Hi there!</p>
    <p>You have received a new submission to your form ${craft.title}.</p>
    <p>To view the submission, click the following link:</p>
    <a href="${process.env.NEXT_PUBLIC_URL}/form/${craft.id}/results">View submission</a>
    <br />
    <p>Thanks!</p>
  `;

  await sendMail(email, subject, text, html);
};
