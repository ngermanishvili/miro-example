import { Resend } from "resend";

// Initialize Resend with API key
const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendVerificationEmail(email: string, token: string) {
  const verificationUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/verify-email?token=${token}`;

  const { data, error } = await resend.emails.send({
    from: process.env.EMAIL_FROM || "onboarding@resend.dev",
    to: email,
    subject: "Verify your email address",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #333; font-size: 24px;">Email Verification</h1>
        <p style="color: #666; font-size: 16px;">Thank you for registering. Please click the link below to verify your email address:</p>
        <a href="${verificationUrl}" style="display: inline-block; background-color: #007bff; color: white; text-decoration: none; padding: 10px 20px; border-radius: 4px; margin: 20px 0;">
          Verify Email
        </a>
        <p style="color: #888; font-size: 14px;">If you didn't request this verification, you can safely ignore this email.</p>
      </div>
    `,
  });

  if (error) {
    console.error("Failed to send verification email:", error);
    throw new Error("Failed to send verification email");
  }

  return data;
}
