"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// A function to check if a user's email is verified
async function checkEmailVerification(email: string) {
  try {
    const response = await fetch("/api/check-verification", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error checking email verification:", error);
    return { verified: false, error: "Failed to check verification status" };
  }
}

// A function to resend verification email
async function resendVerificationEmail(email: string) {
  try {
    const response = await fetch("/api/resend-verification", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error sending verification email:", error);
    return { success: false, message: "Failed to send verification email" };
  }
}

interface AuthFormProps {
  mode: "signin" | "signup";
  callbackUrl?: string | null;
}

export default function AuthForm({ mode, callbackUrl }: AuthFormProps) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [unverifiedEmail, setUnverifiedEmail] = useState<string | null>(null);
  const [resendSuccess, setResendSuccess] = useState(false);

  // Handler for form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setUnverifiedEmail(null);
    setResendSuccess(false);

    if (mode === "signin") {
      try {
        // First check if email exists and is verified (fallback method)
        const verificationCheck = await checkEmailVerification(email);

        // Attempt to sign in with credentials
        const result = await signIn("credentials", {
          redirect: false,
          email,
          password,
          callbackUrl: callbackUrl || "/dashboard",
        });

        console.log("Sign-in result:", result);

        // Handle potential errors
        if (result?.error) {
          // If NextAuth reports an error, check if it's a verification issue
          if (result.error.includes("email-not-verified:")) {
            // Error format properly passed through NextAuth
            const extractedEmail = result.error.split(":")[1];
            setUnverifiedEmail(extractedEmail || email);
            setError("Please verify your email address before signing in.");
          }
          // Use our fallback verification check
          else if (
            verificationCheck.exists &&
            !verificationCheck.verified &&
            !result.error.includes("CredentialsSignin")
          ) {
            // Password seems correct but email isn't verified
            setUnverifiedEmail(email);
            setError("Please verify your email address before signing in.");
          } else {
            // Standard invalid credentials error
            setError("Invalid email or password.");
          }
        } else if (result?.ok) {
          // Successful login
          setLoading(true);

          // Force a hard reload to the dashboard
          window.location.href = "/dashboard";
          return;
        }
      } catch (error) {
        console.error("Sign-in error:", error);
        setError("An unexpected error occurred. Please try again.");
      } finally {
        setLoading(false);
      }
    } else {
      // Handle sign up logic here if needed
      // For now, just show a placeholder
      setError("Sign up functionality would be implemented here");
      setLoading(false);
    }
  };

  // Handler for resending verification email
  const handleResendVerification = async () => {
    if (!unverifiedEmail) return;

    setResendLoading(true);
    const result = await resendVerificationEmail(unverifiedEmail);

    if (result.success) {
      setResendSuccess(true);
    } else {
      setError("Failed to resend verification email. Please try again.");
    }
    setResendLoading(false);
  };

  return (
    <div className="w-full max-w-sm space-y-6">
      <h1 className="text-2xl font-bold text-center mb-6">
        {mode === "signin" ? "Sign In" : "Sign Up"}
      </h1>

      {error && (
        <div
          className={`p-4 rounded-lg mb-6 ${
            unverifiedEmail
              ? "bg-yellow-100 text-yellow-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          <p className="text-sm font-medium">{error}</p>

          {unverifiedEmail && (
            <div className="mt-2">
              {resendSuccess ? (
                <p className="text-xs text-green-600 font-medium">
                  Verification email sent! Please check your inbox.
                </p>
              ) : (
                <Button
                  onClick={handleResendVerification}
                  variant="outline"
                  size="sm"
                  className="text-xs mt-1"
                  disabled={loading}
                >
                  {resendLoading ? "Sending..." : "Resend verification email"}
                </Button>
              )}
            </div>
          )}
        </div>
      )}

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="bg-background px-2 text-muted-foreground">
            {mode === "signin" ? "Sign in with email" : "Sign up with email"}
          </span>
        </div>
      </div>

      {/* Email/Password Form */}
      <form className="space-y-4" onSubmit={handleSubmit}>
        <Input
          name="email"
          placeholder="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
          disabled={loading}
        />
        <Input
          name="password"
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete={mode === "signin" ? "current-password" : "new-password"}
          disabled={loading}
        />
        <Button className="w-full" type="submit" disabled={loading}>
          {loading
            ? mode === "signin"
              ? "Signing in..."
              : "Signing up..."
            : mode === "signin"
            ? "Sign In"
            : "Sign Up"}
        </Button>
      </form>

      <div className="text-center">
        <Button asChild variant="link">
          {mode === "signin" ? (
            <Link href="/sign-up">Don&apos;t have an account? Sign up</Link>
          ) : (
            <Link href="/sign-in">Already have an account? Sign in</Link>
          )}
        </Button>
      </div>
    </div>
  );
}
