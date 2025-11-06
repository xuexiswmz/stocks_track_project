import { getAuth } from "../better-auth/auth";

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
}: {
  email: string;
  password: string;
  username: string;
}) => {
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
      return { success: true, data: response };
    }
    return { success: false, error: "Sign up failed" };
  } catch (e) {
    console.log("Sign up failed", e);
    return { success: false, error: "Sign up failed" };
  }
};
