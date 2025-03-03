// "use client";

// import { useState, useEffect } from "react";
// import Link from "next/link";
// import { useParams, useRouter, useSearchParams } from "next/navigation";
// import { signIn } from "next-auth/react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";

// // A function to check if a user's email is verified
// async function checkEmailVerification(email: string) {
//   try {
//     const response = await fetch("/api/check-verification", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({ email }),
//     });

//     const data = await response.json();
//     return data;
//   } catch (error) {
//     console.error("Error checking email verification:", error);
//     return { verified: false, error: "Failed to check verification status" };
//   }
// }

// // A function to resend verification email
// async function resendVerificationEmail(email: string) {
//   try {
//     const response = await fetch("/api/resend-verification", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({ email }),
//     });

//     const data = await response.json();
//     return data;
//   } catch (error) {
//     console.error("Error sending verification email:", error);
//     return { success: false, message: "Failed to send verification email" };
//   }
// }

// export default function SignInPage() {
//   const router = useRouter();
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [resendLoading, setResendLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [unverifiedEmail, setUnverifiedEmail] = useState<string | null>(null);
//   const [resendSuccess, setResendSuccess] = useState(false);
//   const params = useSearchParams();
//   const callbackUrl = params.get("callbackUrl");
//   console.log("Callback URL:", callbackUrl);
//   // Handler for form submission
//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);
//     setError(null);
//     setUnverifiedEmail(null);
//     setResendSuccess(false);

//     try {
//       // First check if email exists and is verified (fallback method)
//       const verificationCheck = await checkEmailVerification(email);

//       // Attempt to sign in with credentials
//       const result = await signIn("credentials", {
//         redirect: false,
//         email,
//         password,
//       });

//       console.log("Sign-in result:", result);

//       // Handle potential errors
//       if (result?.error) {
//         // If NextAuth reports an error, check if it's a verification issue
//         if (result.error.includes("email-not-verified:")) {
//           // Error format properly passed through NextAuth
//           const extractedEmail = result.error.split(":")[1];
//           setUnverifiedEmail(extractedEmail || email);
//           setError("Please verify your email address before signing in.");
//         }
//         // Use our fallback verification check
//         else if (
//           verificationCheck.exists &&
//           !verificationCheck.verified &&
//           !result.error.includes("CredentialsSignin")
//         ) {
//           // Password seems correct but email isn't verified
//           setUnverifiedEmail(email);
//           setError("Please verify your email address before signing in.");
//         } else {
//           // Standard invalid credentials error
//           setError("Invalid email or password.");
//         }
//       } else if (result?.ok) {
//         // Successful login
//         router.push("/");
//         router.refresh();
//       }
//     } catch (error) {
//       console.error("Sign-in error:", error);
//       setError("An unexpected error occurred. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };
//   // Handler for resending verification email
//   const handleResendVerification = async () => {
//     if (!unverifiedEmail) return;

//     setResendLoading(true);
//     const result = await resendVerificationEmail(unverifiedEmail);

//     if (result.success) {
//       setResendSuccess(true);
//     } else {
//       setError("Failed to resend verification email. Please try again.");
//     }
//     setLoading(false);
//   };

//   return (
//     <div className="w-full max-w-sm mx-auto space-y-6">
//       <h1 className="text-2xl font-bold text-center mb-6">Sign In</h1>

//       {error && (
//         <div
//           className={`p-4 rounded-lg mb-6 ${
//             unverifiedEmail
//               ? "bg-yellow-100 text-yellow-800"
//               : "bg-red-100 text-red-800"
//           }`}
//         >
//           <p className="text-sm font-medium">{error}</p>

//           {unverifiedEmail && (
//             <div className="mt-2">
//               {resendSuccess ? (
//                 <p className="text-xs text-green-600 font-medium">
//                   Verification email sent! Please check your inbox.
//                 </p>
//               ) : (
//                 <Button
//                   onClick={handleResendVerification}
//                   variant="outline"
//                   size="sm"
//                   className="text-xs mt-1"
//                   disabled={loading}
//                 >
//                   {resendLoading ? "Sending..." : "Resend verification email"}
//                 </Button>
//               )}
//             </div>
//           )}
//         </div>
//       )}

//       <div className="relative">
//         <div className="absolute inset-0 flex items-center">
//           <span className="w-full border-t" />
//         </div>
//         <div className="relative flex justify-center text-sm">
//           <span className="bg-background px-2 text-muted-foreground">
//             Sign in with email
//           </span>
//         </div>
//       </div>

//       {/* Email/Password Sign In */}
//       <form className="space-y-4" onSubmit={handleSubmit}>
//         <Input
//           name="email"
//           placeholder="Email"
//           type="email"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           required
//           autoComplete="email"
//           disabled={loading}
//         />
//         <Input
//           name="password"
//           placeholder="Password"
//           type="password"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           required
//           autoComplete="current-password"
//           disabled={loading}
//         />
//         <Button className="w-full" type="submit" disabled={loading}>
//           {loading ? "Signing in..." : "Sign In"}
//         </Button>
//       </form>

//       <div className="text-center">
//         <Button asChild variant="link">
//           <Link href="/sign-up">Don&apos;t have an account? Sign up</Link>
//         </Button>
//       </div>
//     </div>
//   );
// }

"use client";

import { useSearchParams } from "next/navigation";
import AuthForm from "@/app/(auth)/(components)/authForm";

export default function SignInPage() {
  const params = useSearchParams();
  const callbackUrl = params.get("callbackUrl");
  console.log("Callback URL:", callbackUrl);

  // Check if we should render AI dashboard content
  const isAIDashboard = callbackUrl?.includes("/dashboard/ai");

  // Check if we should render Forum dashboard content
  const isForumDashboard = callbackUrl?.includes("/dashboard/forum");

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      {/* Left side content - conditionally rendered */}
      <div className="w-full md:w-1/2 p-8 flex flex-col justify-center">
        {isAIDashboard && (
          <div className="space-y-6">
            <h1 className="text-3xl font-bold">AI Assistant Dashboard</h1>
            <p className="text-lg text-gray-600">
              Sign in to access your personalized AI assistant dashboard.
              Unleash the power of artificial intelligence to streamline your
              workflow.
            </p>
            <div className="bg-blue-50 p-6 rounded-xl">
              <h2 className="text-xl font-semibold mb-3">
                AI Dashboard Features
              </h2>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <span className="mr-2">✓</span>
                  <span>
                    Smart content generation with our advanced AI models
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">✓</span>
                  <span>
                    Personalized recommendations based on your preferences
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">✓</span>
                  <span>Automated data analysis and visualization tools</span>
                </li>
              </ul>
            </div>
          </div>
        )}

        {isForumDashboard && (
          <div className="space-y-6">
            <h1 className="text-3xl font-bold">Community Forum Dashboard</h1>
            <p className="text-lg text-gray-600">
              Sign in to connect with like-minded individuals, share knowledge,
              and participate in engaging discussions.
            </p>
            <div className="bg-green-50 p-6 rounded-xl">
              <h2 className="text-xl font-semibold mb-3">Forum Features</h2>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <span className="mr-2">✓</span>
                  <span>Create and join topic-focused discussion threads</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">✓</span>
                  <span>Direct messaging with other community members</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">✓</span>
                  <span>Regular community events and challenges</span>
                </li>
              </ul>
            </div>
          </div>
        )}

        {/* Default content if no specific callback */}
        {!isAIDashboard && !isForumDashboard && (
          <div className="space-y-6">
            <h1 className="text-3xl font-bold">Welcome Back</h1>
            <p className="text-lg text-gray-600">
              Sign in to your account to access all features and continue your
              journey.
            </p>
            <div className="bg-purple-50 p-6 rounded-xl">
              <h2 className="text-xl font-semibold mb-3">Platform Benefits</h2>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <span className="mr-2">✓</span>
                  <span>Personalized dashboard with your recent activity</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">✓</span>
                  <span>Seamless synchronization across all your devices</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">✓</span>
                  <span>Priority access to new features and updates</span>
                </li>
              </ul>
            </div>
          </div>
        )}
      </div>

      {/* Right side - always shows the form */}
      <div className="w-full md:w-1/2 bg-gray-50 p-8 flex items-center justify-center">
        <AuthForm mode="signin" callbackUrl={callbackUrl} />
      </div>
    </div>
  );
}
