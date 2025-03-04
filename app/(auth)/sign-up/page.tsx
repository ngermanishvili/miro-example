import { signUp } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/auth";

const Page = async ({
  searchParams,
}: {
  searchParams: { success?: string; email?: string };
}) => {
  const session = await auth();
  if (session) redirect("/");

  // Await searchParams to get the actual parameters
  const params = await searchParams;

  // Get success parameter and email from URL - use optional chaining
  const success = params?.success === "true";
  const email = params?.email;
  return (
    <div className="w-full max-w-sm mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-center mb-6">Create Account</h1>

      {success && email && (
        <div className="bg-green-100 text-green-800 p-4 rounded-lg mb-4">
          <h3 className="font-medium mb-1">Check your email</h3>
          <p className="text-sm">
            We've sent a verification link to <strong>{email}</strong>. Please
            check your inbox and click the link to verify your account.
          </p>
        </div>
      )}

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="bg-background px-2 text-muted-foreground">
            Sign up with email
          </span>
        </div>
      </div>

      {/* Email/Password Sign Up */}
      <form
        className="space-y-4"
        action={async (formData) => {
          "use server";
          const email = formData.get("email") as string;
          const res = await signUp(formData);

          if (res.success) {
            redirect(
              `/sign-up?success=true&email=${encodeURIComponent(email)}`
            );
          }
        }}
      >
        <Input
          name="email"
          placeholder="Email"
          type="email"
          required
          autoComplete="email"
        />
        <Input
          name="password"
          placeholder="Password"
          type="password"
          required
          autoComplete="new-password"
        />
        <Button className="w-full" type="submit">
          Sign Up
        </Button>
      </form>

      <div className="text-center">
        <Button asChild variant="link">
          <Link href="/sign-in">Already have an account? Sign in</Link>
        </Button>
      </div>
    </div>
  );
};

export default Page;
