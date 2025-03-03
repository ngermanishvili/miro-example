import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const token = request.nextUrl.searchParams.get("token");

    if (!token) {
      return NextResponse.redirect(new URL("/verification-error", request.url));
    }

    // Find the user with this verification token
    const user = await db.user.findFirst({
      where: {
        verificationToken: token,
      },
    });

    if (!user) {
      return NextResponse.redirect(new URL("/verification-error", request.url));
    }

    // Check if already verified (prevent repeated verification)
    if (user.emailVerified) {
      return NextResponse.redirect(
        new URL("/verification-success", request.url)
      );
    }

    // Update the user to mark email as verified
    await db.user.update({
      where: { id: user.id },
      data: {
        emailVerified: new Date(),
        verificationToken: null,
      },
    });

    // Redirect to a success page
    return NextResponse.redirect(new URL("/verification-success", request.url));
  } catch (error) {
    console.error("Error verifying email:", error);
    return NextResponse.redirect(new URL("/verification-error", request.url));
  }
}
