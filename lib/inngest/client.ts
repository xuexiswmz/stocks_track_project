import { Inngest } from "inngest";

export const inngest = new Inngest({
  id: "stock_app",
  ai: {
    deepseek: {
      apiKey: process.env.DEEPSEEK_API_KEY,
    },
  },
});
