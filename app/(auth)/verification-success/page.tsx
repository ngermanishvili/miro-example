import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function VerificationSuccessPage() {
  return (
    <div className="text-center space-y-4">
      <div className="bg-green-100 text-green-800 p-6 rounded-lg mb-4">
        <h1 className="text-2xl font-bold mb-2">
          Email Verified Successfully!
        </h1>
        <p>
          Your email has been verified. You can now sign in to your account.
        </p>
      </div>

      <Button asChild>
        <Link href="/sign-in">Sign In</Link>
      </Button>
    </div>
  );
}
