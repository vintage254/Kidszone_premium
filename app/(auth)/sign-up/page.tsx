"use client";

import AuthForm from "@/components/AuthForm";
import { signUpSchema } from "@/lib/validations";
import { signUp } from "@/lib/actions/auth";

const Page = () => (
  <AuthForm
    type="SIGN_UP"
    schema={signUpSchema}
    defaultValues={{
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      refNo: "",
    }}
    onSubmit={signUp}
  />
);

export default Page;
