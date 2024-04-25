import * as AWS from "aws-sdk";
import * as nodemailer from "nodemailer";

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: "eu-central-1",
});

const ses = new AWS.SES({ apiVersion: "2010-12-01" });

const adminMail = "hello@formcraft.io";

const transporter = nodemailer.createTransport({
  SES: ses,
});

export const sendMail = async (
  to: string,
  subject: string,
  text: string,
  html: string
) => {
  try {
    await transporter.sendMail({
      from: adminMail,
      to,
      subject,
      text,
      html,
    });
  } catch (e) {
    console.error(e);
  }
};
