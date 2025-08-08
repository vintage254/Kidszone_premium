"use server";

import { eq } from "drizzle-orm";
import { db } from "@/database/drizzle";
import { users } from "@/database/schema";
import { hash } from "bcryptjs";
import { signIn, signOut } from "@/auth";
import { z } from "zod";
import { signInSchema, signUpSchema } from "@/lib/validations";

import { AuthError } from "next-auth";

export const signInWithCredentials = async (
  params: z.infer<typeof signInSchema>
) => {
  try {
    await signIn("credentials", {
      ...params,
      redirectTo: "/",
    });
    return { success: true };
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { success: false, error: "Invalid email or password" };
        default:
          return { success: false, error: "An unknown error occurred" };
      }
    }
    throw error;
  }
};

export const signUp = async (params: z.infer<typeof signUpSchema>) => {
  const { username, email, password, refNo } = params;

  const existingUser = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  if (existingUser.length > 0) {
    return { success: false, error: "User already exists" };
  }

  const hashedPassword = await hash(password, 10);

  try {
    await db.insert(users).values({
      fullName: username,
      email,
      password: hashedPassword,
      refNo,
    });

    await signInWithCredentials({ email, password });

    return { success: true };
  } catch (error) {
    console.log(error, "Signup error");
    return { success: false, error: "Signup error" };
  }
};

export const signInWithGoogle = async () => {
  await signIn("google", { redirectTo: "/" });
};

export const signOutAction = async () => {
  await signOut({ redirectTo: "/" });
};
