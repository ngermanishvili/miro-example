import NextAuth from "next-auth";
import { type DefaultSession } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import { pgPool } from "@/lib/db";

interface UserRecord {
  id: string;
  email: string;
  password: string | null;
  emailVerified: Date | null;
  name: string | null;
}

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      emailVerified: Date | null;
    } & DefaultSession["user"];
  }

  interface User {
    emailVerified: Date | null;
  }
}

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // 24 hours
  },
  cookies: {
    sessionToken: {
      name:
        process.env.NODE_ENV === "production"
          ? "__Secure-next-auth.session-token"
          : "next-auth.session-token",
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
  },
  pages: {
    signIn: "/sign-in",
    error: "/sign-in",
    verifyRequest: "/verify-email",
  },
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "credentials",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "hello@example.com",
        },
        password: {
          label: "Password",
          type: "password",
        },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Invalid credentials");
        }

        const email = String(credentials.email);
        const password = String(credentials.password);

        const result = await pgPool.query<UserRecord>(
          `SELECT id, email, password, "emailVerified", name
           FROM "User"
           WHERE email = $1
           LIMIT 1`,
          [email]
        );

        const user = result.rows[0];

        if (!user?.password) {
          throw new Error("Invalid credentials");
        }

        if (!user.emailVerified) {
          throw new Error("Please verify your email first");
        }

        const isPasswordValid = await compare(password, user.password);

        if (!isPasswordValid) {
          throw new Error("Invalid credentials");
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          emailVerified: user.emailVerified,
        };
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.sub!;
        session.user.email = token.email!;
        session.user.emailVerified = token.emailVerified as Date | null;
      }
      console.log("Session callback completed for:", session?.user?.email);
      return session;
    },
    async jwt({ token, user, account }) {
      if (user) {
        token.sub = user.id;
        token.email = user.email;
        token.emailVerified = user.emailVerified;
        console.log("JWT callback - User authenticated:", user.email);
      }
      return token;
    },
    async redirect({ url, baseUrl }) {
      console.log("Redirect callback - URL:", url, "BaseURL:", baseUrl);

      // For credential callbacks, allow as-is
      if (url.includes("/api/auth/callback/credentials")) {
        return url;
      }

      // Special case for dashboard
      if (url === `${baseUrl}/dashboard` || url === "/dashboard") {
        return `${baseUrl}/dashboard`;
      }

      // For any sign-in URL, redirect to dashboard
      if (url.includes("/sign-in")) {
        return `${baseUrl}/dashboard`;
      }

      // If URL is relative, prepend baseUrl
      if (url.startsWith("/")) {
        return `${baseUrl}${url}`;
      }

      // For URLs on the same origin, allow as-is
      if (url.startsWith(baseUrl)) {
        return url;
      }

      // Default fallback
      return `${baseUrl}/dashboard`;
    },
  },
  debug: true, // Enable debug mode always for now
  logger: {
    error(error: Error) {
      console.error("NextAuth Error:", error);
    },
    warn(code: string) {
      console.warn("NextAuth Warning:", code);
    },
    debug(message: string, metadata?: unknown) {
      console.log("NextAuth Debug:", message, metadata);
    },
  },
  events: {
    async signIn({ user }) {
      console.log("User signed in:", user.email);
    },
    async session({ session }) {
      console.log("Session updated for:", session?.user?.email);
    },
  },
  trustHost: true,
});
