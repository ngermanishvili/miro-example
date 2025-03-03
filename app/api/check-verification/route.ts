import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { exists: false, verified: false, error: "Email is required" },
        { status: 400 }
      );
    }

    // Find the user
    const user = await db.user.findUnique({
      where: { email: email.toLowerCase() },
      select: { id: true, emailVerified: true },
    });

    // If user doesn't exist, return generic response for security
    if (!user) {
      return NextResponse.json(
        { exists: false, verified: false },
        { status: 200 }
      );
    }

    // Return verification status
    return NextResponse.json(
      {
        exists: true,
        verified: user.emailVerified !== null,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error checking email verification:", error);
    return NextResponse.json(
      {
        exists: false,
        verified: false,
        error: "Failed to check verification status",
      },
      { status: 500 }
    );
  }
}
