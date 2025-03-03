import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { v4 as uuidv4 } from "uuid";
import { sendVerificationEmail } from "@/lib/email";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { success: false, message: "Email is required" },
        { status: 400 }
      );
    }

    // Find the user
    const user = await db.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!user) {
      // For security reasons, don't reveal if the user exists or not
      return NextResponse.json(
        {
          success: true,
          message: "If the email exists, a verification email has been sent",
        },
        { status: 200 }
      );
    }

    // Skip if email is already verified
    if (user.emailVerified) {
      return NextResponse.json(
        { success: true, message: "Email is already verified" },
        { status: 200 }
      );
    }

    // Generate a new verification token
    const verificationToken = uuidv4();

    // Update the user with the new token
    await db.user.update({
      where: { id: user.id },
      data: { verificationToken },
    });

    // Send verification email
    await sendVerificationEmail(email, verificationToken);

    return NextResponse.json(
      { success: true, message: "Verification email sent" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error sending verification email:", error);
    return NextResponse.json(
      { success: false, message: "Failed to send verification email" },
      { status: 500 }
    );
  }
}
