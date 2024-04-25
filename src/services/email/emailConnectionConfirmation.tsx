import type { Craft } from "@prisma/client";
import { sendMail } from ".";

export const emailConnectionConfirmation = async (
  email: string,
  code: string,
  craft: Craft
) => {
  const subject = "Confirm your email connection";
  const text = `
    Hi there!
    You are receiving this email because you have requested to connect your email to "${craft.title}".
    Please click the link below to confirm your email connection:
    ${process.env.NEXT_PUBLIC_SITE_URL}/email-connector/confirm?code=${code}&formId=${craft.id}
    If you did not request this, please ignore this email.
    Thanks!
  `;

  const html = `
    <p>Hi there!</p>
    <p>You are receiving this email because you have requested to connect your email to "${craft.title}".</p>
    <p>Please click the link below to confirm your email connection:</p>
    <a href="${process.env.NEXT_PUBLIC_URL}/email-connector/confirm?code=${code}&formId=${craft.id}">Confirm email connection</a>
    <p>If you did not request this, please ignore this email.</p>
    <p>Thanks!</p>
  `;

  await sendMail(email, subject, text, html);
};
