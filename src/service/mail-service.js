const nodemailer = require("nodemailer");
const error_handling = require("../utils/error-handling");
const logger = require("../utils/logger-winston");

const mail_service = async (options) => {
  try {
    const transporter = await nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: process.env.MAIL_PORT,
      secure: false,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASSWORD,
      },
    });

    const mailOption = {
      from: `Mailtrap for mail testing`,
      to: options.to,
      replyTo: options.replyTo,
      subject: options.subject,
      html: options.message,
    };

    await transporter.sendMail(mailOption);
  } catch (error) {
    logger.error(error.library, 500);
    return new error_handling(error.library, 500);
  }
};

module.exports = mail_service;
