"use client";
import FooterLink from "@/components/forms/FooterLink";
import InputField from "@/components/forms/InputField";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";

const SignIn = () => {
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm<SignInFormData>({
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onBlur",
  });
  const onSubmit = async (data: SignInFormData) => {
    try {
      console.log(data);
    } catch (e) {
      console.error(e);
    }
  };
  return (
    <>
      <h1 className="form-title">Sign In</h1>
      <form onSubmit={handleSubmit(() => onSubmit)} className="space-y-5">
        <InputField
          name="email"
          label="Email"
          type="email"
          placeholder="Enter your email"
          error={errors.email}
          register={register}
          validation={{
            required: "Email is required",
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: "Invalid email address",
            },
          }}
        />
        <InputField
          name="password"
          label="Password"
          type="password"
          placeholder="Enter your password"
          error={errors.password}
          register={register}
          validation={{ required: "Password is required", minlength: 8 }}
        />
        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full mt-5 yellow-btn"
        >
          {isSubmitting ? "Signing in..." : "Sign In"}
        </Button>
        <FooterLink
          text="Don't have an account?"
          linkText="Sign Up"
          href="/sign-up"
        />
      </form>
    </>
  );
};
export default SignIn;
