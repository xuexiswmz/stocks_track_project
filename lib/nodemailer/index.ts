import nodemailer from "nodemailer";
import {
  NEWS_SUMMARY_EMAIL_TEMPLATE,
  WELCOME_EMAIL_TEMPLATE,
} from "./templates";

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
  connectionTimeout: 120000, // 增加到120秒连接超时
  greetingTimeout: 60000, // 增加到60秒问候超时
  socketTimeout: 120000, // 增加到120秒socket超时
  pool: true, // 使用连接池
  maxConnections: 1, // 限制并发连接数
  maxMessages: 3, // 每个连接最多发送3封邮件
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
    // 发送邮件
    const result = await transporter.sendMail(mailOptions);
    return result;
  } catch (error) {
    throw new Error(
      `Failed to send welcome email: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
};
export const sendNewsSummaryEmail = async ({
  email,
  date,
  newsContent,
}: {
  email: string;
  date: string;
  newsContent: string;
}): Promise<void> => {
  const htmlTemplate = NEWS_SUMMARY_EMAIL_TEMPLATE.replace(
    "{{date}}",
    date
  ).replace("{{newsContent}}", newsContent);

  const mailOptions = {
    from: `"Signalist Stocks App" <${process.env.NODEMAILER_EMAIL}>`,
    to: email,
    subject: `📈 Market News Summary Today - ${date}`,
    text: `Today's market news summary from Signalist`,
    html: htmlTemplate,
  };

  try {
    // 验证连接
    console.log("Verifying SMTP connection...");
    await transporter.verify();
    console.log("SMTP connection verified successfully");

    // 发送邮件
    console.log(`Sending news summary email to: ${email}`);
    const result = await transporter.sendMail(mailOptions);
    console.log(`Email sent successfully to ${email}:`, result.messageId);
  } catch (error) {
    console.error("Email sending failed:", error);

    // 提供更详细的错误信息
    if (error instanceof Error) {
      if (error.message.includes("ETIMEDOUT")) {
        throw new Error(
          `SMTP connection timeout - please check network connectivity and Gmail settings: ${error.message}`
        );
      } else if (error.message.includes("Authentication failed")) {
        throw new Error(
          `Gmail authentication failed - please check email credentials and enable 2FA with App Password: ${error.message}`
        );
      } else if (error.message.includes("Invalid login")) {
        throw new Error(
          `Invalid Gmail credentials - please verify NODEMAILER_EMAIL and NODEMAILER_PASSWORD: ${error.message}`
        );
      }
    }

    throw new Error(
      `Failed to send news summary email: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
};
