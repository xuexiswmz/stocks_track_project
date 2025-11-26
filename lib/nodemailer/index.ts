import nodemailer from "nodemailer";
import { WELCOME_EMAIL_TEMPLATE } from "./templates";

export const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587, // 使用587端口
  secure: false, // 587端口使用STARTTLS
  auth: {
    user: process.env.NODEMAILER_EMAIL!,
    pass: process.env.NODEMAILER_PASSWORD!,
  },
  tls: {
    rejectUnauthorized: false, // 在开发环境中允许自签名证书
  },
  connectionTimeout: 60000, // 60秒连接超时
  greetingTimeout: 30000, // 30秒问候超时
  socketTimeout: 60000, // 60秒socket超时
});

export const sendWelcomeEmail = async ({
  email,
  name,
  intro,
}: WelcomeEmailData) => {
  const htmlTemplate = WELCOME_EMAIL_TEMPLATE.replace("{{name}}", name).replace(
    "{{intro}}",
    intro
  );

  const mailOptions = {
    from: `"Signalist Stocks App" <${process.env.NODEMAILER_EMAIL}>`,
    to: email,
    subject: "Welcome to Signalist Stocks App",
    text: "Thanks for joining Signalist",
    html: htmlTemplate,
  };

  try {
    // 验证连接
    await transporter.verify();
    console.log("SMTP connection verified successfully");

    // 发送邮件
    const result = await transporter.sendMail(mailOptions);
    console.log("Email sent successfully:", result.messageId);
    return result;
  } catch (error) {
    console.error("Email sending failed:", error);
    throw new Error(
      `Failed to send welcome email: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
};
