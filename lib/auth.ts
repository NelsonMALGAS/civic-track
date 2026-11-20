import { betterAuth, type User as UserType } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/db";
import * as authSchemas from "../auth-schema";
import { nextCookies } from "better-auth/next-js";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

type Auth = {
  user: UserType;
  url: string;
  token: string;
};

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg", // or "mysql", "sqlite"
    schema: authSchemas,
  }),
  baseURL: process.env.BETTER_AUTH_URL,
  emailVerification: {
    // Send verification email immediately after signup
    sendVerificationEmail: async ({ user, url, token }: Auth) => {
      await resend.emails.send({
        from: "ExperienceIQ <noreply@experienceiqplatform.com>",
        to: user.email,
        subject: "Verify your email address",
        html: `<p>Hello ${user.name},</p>
               <p>Please click the link below to verify your account:</p>
               <a href="${url}">Verify Email Address</a>`,
      });

      console.log(token);
      console.log({ url }, "URL");
    },
    sendOnSignUp: true,
  },
  emailAndPassword: {
    enabled: true,
    resetPasswordTokenExpiresIn: 3600,
    // requireEmailVerification: true,

    sendResetPassword: async ({ user, url }: Auth) => {
      await resend.emails.send({
        from: "ExperienceIQ <noreply@experienceiqplatform.com>",
        to: user.email,
        subject: "Reset your password",
        html: `
        <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
          <h2 style="color: #111;">Reset your password</h2>
          <p>Hello ${user.name},</p>
          <p>We received a request to reset the password for your ExperienceIQ account. Click the button below to choose a new password.</p>
          <p style="margin: 24px 0;">
            <a href="${url}" style="background: #111; color: #fff; padding: 12px 24px; border-radius: 6px; text-decoration: none; display: inline-block;">
              Reset Password
            </a>
          </p>
          <p style="color: #555; font-size: 14px;">Or copy and paste this link into your browser:</p>
          <p style="color: #555; font-size: 14px; word-break: break-all;">${url}</p>
          <p style="color: #555; font-size: 14px;">This link expires in 1 hour. If you didn't request a password reset, you can safely ignore this email — your password will not be changed.</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;" />
          <p style="color: #999; font-size: 12px;">ExperienceIQ</p>
        </div>
      `,
      });
    },

    onPasswordReset: async ({ user }) => {
      // No sensitive data — safe to log for auditing.
      console.log(`Password reset completed for ${user.email}`);
    },
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
    github: {
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    },
  },
  //   user: {
  //     additionalFields: {
  //       role: {
  //         type: "string",
  //         required: false,
  //         defaultValue: "user",
  //         input: false,
  //         validator: {
  //           input: z.enum(["admin", "moderator", "organization", "user"]),
  //         },
  //       },
  //     },
  //   },
  plugins: [nextCookies()],
});
