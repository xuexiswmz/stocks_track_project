import { getNews } from "../actions/finnhub.actions";
import { getAllUsersForNewEamil } from "../actions/user.action";
import { getWatchlistSymbolsByEmail } from "../actions/watchlist.actions";
import { sendNewsSummaryEmail, sendWelcomeEmail } from "../nodemailer";
import { formatDateToday } from "../utils";
import { inngest } from "./client";
import {
  NEWS_SUMMARY_EMAIL_PROMPT,
  PERSONALIZED_WELCOME_EMAIL_PROMPT,
} from "./prompt";

export const sendSignUpEmail = inngest.createFunction(
  { id: "sign-up-email" },
  { event: "app/user.created" },
  async ({ event, step }) => {
    const userProfile = `
            - Country: ${event.data.country}
            - Investment goals: ${event.data.investmentGoals}
            - Risk tolerance: ${event.data.riskTolerance}
            - Preferred industry: ${event.data.preferredIndustry}
        `;

    const prompt = PERSONALIZED_WELCOME_EMAIL_PROMPT.replace(
      "{{user_profile}}",
      userProfile
    );
    const response = await step.ai.infer("generator-welcome-intro", {
      model: step.ai.models.deepseek({ model: "deepseek-chat" }),
      body: {
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
      },
    });
    await step.run("send-welcome-email", async () => {
      const introText =
        response.choices?.[0]?.message?.content || "Thanks for joining us!";

      const {
        data: { email, name },
      } = event;
      return await sendWelcomeEmail({
        email,
        name,
        intro: introText,
      });
    });

    return {
      success: true,
      message: "Welcome email sent successfully",
    };
  }
);
export const sendDailyNewSummary = inngest.createFunction(
  { id: "send-daily-new-summary" },
  [{ event: "app/send.daily.news" }, { cron: "0 12 * * *" }],
  async ({ step }) => {
    // 获取所有用户
    const users = await step.run("get-all-users", getAllUsersForNewEamil);
    if (!users || users.length === 0) {
      return { success: false, message: "No users found for news email" };
    }
    // 获取每个用户订阅/关注的新闻
    const result = await step.run("fetch-user-news", async () => {
      const perUser: Array<{
        user: User;
        articles: MarketNewsArticle[];
      }> = [];
      for (const user of users as User[]) {
        try {
          const symbols = await getWatchlistSymbolsByEmail(user.email);
          let articles = await getNews(symbols);
          articles = (articles || []).slice(0, 6);
          if (!articles || articles.length === 0) {
            articles = await getNews();
            articles = (articles || []).slice(0, 6);
          }
          perUser.push({ user, articles });
        } catch (e) {
          console.error("daily-news: error preparing user news", user.email, e);
          perUser.push({ user, articles: [] });
        }
      }
      return perUser; // 添加这行来返回结果
    });

    // 使用ai总结用户关注的新闻
    const userNewsSummaries: { user: User; newsContent: string | null }[] = [];
    for (const { user, articles } of result) {
      try {
        const prompt = NEWS_SUMMARY_EMAIL_PROMPT.replace(
          "{{newsData}}",
          JSON.stringify(articles, null, 2)
        );
        const response = await step.ai.infer(`summarize-news=${user.email}`, {
          model: step.ai.models.deepseek({ model: "deepseek-chat" }),
          body: {
            messages: [
              {
                role: "user",
                content: prompt,
              },
            ],
          },
        });
        const newsContent =
          response.choices?.[0]?.message?.content || "Thanks for joining us!";
        userNewsSummaries.push({ user, newsContent });
      } catch (e) {
        console.error("Failed to summarize news for user", user.email, e);
        userNewsSummaries.push({ user, newsContent: null });
      }
    }

    // 发送邮件
    await step.run("send-news-emails", async () => {
      const emailResults = [];

      // 逐个发送邮件，避免并发连接问题
      for (const { user, newsContent } of userNewsSummaries) {
        if (!newsContent) {
          console.log(`Skipping email for ${user.email} - no news content`);
          emailResults.push({
            email: user.email,
            success: false,
            reason: "No content",
          });
          continue;
        }

        try {
          console.log(`Attempting to send email to: ${user.email}`);
          await sendNewsSummaryEmail({
            email: user.email,
            date: formatDateToday,
            newsContent,
          });
          console.log(`Successfully sent email to: ${user.email}`);
          emailResults.push({ email: user.email, success: true });

          // 在邮件之间添加小延迟，避免过快发送
          await new Promise((resolve) => setTimeout(resolve, 1000));
        } catch (error) {
          console.error(`Failed to send email to ${user.email}:`, error);
          emailResults.push({
            email: user.email,
            success: false,
            error: error instanceof Error ? error.message : "Unknown error",
          });

          // 如果是连接超时错误，等待更长时间再继续
          if (error instanceof Error && error.message.includes("ETIMEDOUT")) {
            console.log(
              "Waiting 5 seconds before next attempt due to timeout..."
            );
            await new Promise((resolve) => setTimeout(resolve, 5000));
          }
        }
      }

      return emailResults;
    });
    return {
      success: true,
      message: "Daily news summary emails sent successfully",
    };
  }
);
