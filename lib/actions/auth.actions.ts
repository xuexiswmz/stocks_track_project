import { getAuth } from "../better-auth/auth";
import { inngest } from "../inngest/client";

export interface SignUpFormData {
  email: string;
  password: string;
  username: string;
  country?: string;
  investmentGoals?: string;
  riskTolerance?: string;
  preferredIndustry?: string;
}

export const signUpWithEmail = async ({
  email,
  password,
  username,
  country,
  investmentGoals,
  riskTolerance,
  preferredIndustry,
}: SignUpFormData) => {
  try {
    const authClient = await getAuth();
    const response = await authClient.api.signUpEmail({
      body: {
        email,
        password,
        name: username,
      },
    });
    if (response) {
      await inngest.send({
        name: "app/user.created",
        data: {
          email,
          name: username,
          country,
          investmentGoals,
          riskTolerance,
          preferredIndustry,
        },
      });
    }
    return { success: true };
  } catch (e) {
    console.log("Sign up failed", e);
    return { success: false, error: "Sign up failed" };
  }
};
