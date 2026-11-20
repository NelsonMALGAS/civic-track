"use server";

import { headers } from "next/headers";
import { APIError } from "better-auth/api";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { z } from "zod";

const APP_URL = process.env.BETTER_AUTH_URL ?? "http://localhost:3000";

const forgotPasswordSchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email("Please enter a valid email address."),
});

const resetPasswordSchema = z
  .object({
    token: z.string().min(1, "This reset link is invalid or has expired."),
    password: z.string().min(8, "Password must be at least 8 characters."),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

type SignUpInput = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

type SignUpResult = { success: true } | { success: false; message: string };

type Session = Awaited<ReturnType<typeof auth.api.getSession>>;

export async function getServerSession(): Promise<Session> {
  try {
    return await auth.api.getSession({
      headers: await headers(),
    });
  } catch (error) {
    console.error("getSessionAction failed:", error);
    return null;
  }
}

export async function signUpAction(input: SignUpInput): Promise<SignUpResult> {
  const name = input.name.trim();
  const email = input.email.trim().toLowerCase();
  const { password, confirmPassword } = input;

  // ── Server-side validation (never trust the client) ──────────────────────
  if (!name) {
    return { success: false, message: "Please enter your full name." };
  }
  if (!email) {
    return { success: false, message: "Please enter your email." };
  }
  if (password.length < 8) {
    return {
      success: false,
      message: "Password must be at least 8 characters.",
    };
  }

  if (password !== confirmPassword) {
    return {
      success: false,
      message: "Passwords do not match",
    };
  }

  try {
    await auth.api.signUpEmail({
      body: { name, email, password },
      headers: await headers(),
    });

    return { success: true };
  } catch (error) {
    // better-auth throws APIError with a human-readable message
    // (e.g. "User already exists") — surface that directly when we can.
    if (error instanceof APIError) {
      return { success: false, message: error.message };
    }

    console.error("signUpAction failed:", error);
    return {
      success: false,
      message: "Something went wrong. Please try again.",
    };
  }
}

type SignInInput = {
  email: string;
  password: string;
};

type SignInResult = { success: true } | { success: false; message: string };

export async function signInAction(input: SignInInput): Promise<SignInResult> {
  const email = input.email.trim().toLowerCase();
  const { password } = input;

  if (!email) {
    return { success: false, message: "Please enter your email." };
  }
  if (!password) {
    return { success: false, message: "Please enter your password." };
  }

  try {
    await auth.api.signInEmail({
      body: { email, password },
      headers: await headers(),
    });

    return { success: true };
  } catch (error) {
    if (error instanceof APIError) {
      return { success: false, message: error.message };
    }

    console.error("signInAction failed:", error);
    return {
      success: false,
      message: "Something went wrong. Please try again.",
    };
  }
}

// ── Sign Out ─────────────────────────────────────────────────────────────

type SignOutResult = { success: true } | { success: false; message: string };

export async function signOutAction(): Promise<SignOutResult> {
  try {
    await auth.api.signOut({
      headers: await headers(),
    });

    return { success: true };
  } catch (error) {
    if (error instanceof APIError) {
      return { success: false, message: error.message };
    }

    console.error("signOutAction failed:", error);
    return {
      success: false,
      message: "Something went wrong. Please try again.",
    };
  }
}

// ── Social Sign In ───────────────────────────────────────────────────────

type SocialProvider = "google" | "github";

type SignInSocialInput = {
  provider: SocialProvider;
  callbackURL?: string;
};

type SignInSocialResult =
  | { success: true; url: string }
  | { success: false; message: string };

export async function signInSocialAction(
  input: SignInSocialInput,
): Promise<SignInSocialResult> {
  const { provider, callbackURL } = input;

  try {
    const result = await auth.api.signInSocial({
      body: {
        provider,
        callbackURL: callbackURL ?? "/",
      },
      headers: await headers(),
    });

    if (!result?.url) {
      return {
        success: false,
        message: "Could not start social sign-in. Please try again.",
      };
    }

    return { success: true, url: result.url };
  } catch (error) {
    if (error instanceof APIError) {
      return { success: false, message: error.message };
    }

    console.error("signInSocialAction failed:", error);
    return {
      success: false,
      message: "Something went wrong. Please try again.",
    };
  }
}

type ActionResult =
  | { success: true; message?: string }
  | { success: false; message: string };

export async function forgotPasswordAction(input: {
  email: string;
}): Promise<ActionResult> {
  const parsed = forgotPasswordSchema.safeParse(input);

  const genericSuccess: ActionResult = {
    success: true,
    message:
      "If an account exists with that email address, we've sent a password reset link.",
  };

  if (!parsed.success) {
    return {
      success: false,
      message:
        parsed.error.issues[0]?.message ??
        "Please enter a valid email address.",
    };
  }

  const { email } = parsed.data;

  try {
    await auth.api.requestPasswordReset({
      body: {
        email,
        redirectTo: `${APP_URL}/auth/reset-password`,
      },
    });
  } catch (error) {
    if (!(error instanceof APIError)) {
      console.error("forgotPasswordAction failed:", error);
    }
  }

  return genericSuccess;
}

export async function resetPasswordAction(input: {
  token: string;
  password: string;
  confirmPassword: string;
}): Promise<ActionResult> {
  const parsed = resetPasswordSchema.safeParse(input);

  if (!parsed.success) {
    return {
      success: false,
      message: parsed.error.issues[0]?.message ?? "Invalid input.",
    };
  }

  const { token, password } = parsed.data;

  try {
    await auth.api.resetPassword({
      body: {
        newPassword: password,
        token,
      },
    });

    return {
      success: true,
      message: "Your password has been reset. You can now sign in.",
    };
  } catch (error) {
    if (error instanceof APIError) {
      return {
        success: false,
        message: error.message || "This reset link is invalid or has expired.",
      };
    }

    console.error("resetPasswordAction failed:", error);
    return {
      success: false,
      message: "Something went wrong. Please try again.",
    };
  }
}

// Optional convenience wrapper if you'd rather redirect server-side
// instead of handling the URL on the client:
export async function signInSocialRedirectAction(
  input: SignInSocialInput,
): Promise<{ success: false; message: string } | never> {
  const result = await signInSocialAction(input);

  if (!result.success) {
    return result;
  }

  redirect(result.url);
}
