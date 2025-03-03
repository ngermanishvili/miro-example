import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function VerificationErrorPage() {
  return (
    <div className="text-center space-y-4">
      <div className="bg-red-100 text-red-800 p-6 rounded-lg mb-4">
        <h1 className="text-2xl font-bold mb-2">Verification Failed</h1>
        <p>
          We couldn't verify your email address. The verification link may be
          invalid or expired.
        </p>
      </div>

      <div className="space-y-2">
        <p>Please try again or sign in to request a new verification email.</p>
        <Button asChild>
          <Link href="/sign-in">Sign In</Link>
        </Button>
      </div>
    </div>
  );
}
