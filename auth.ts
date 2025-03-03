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
      return session;
    },
    async jwt({ token, user, account }) {
      if (user) {
        token.sub = user.id;
        token.email = user.email;
        token.emailVerified = user.emailVerified;
      }
      return token;
    },
    async redirect({ url, baseUrl }) {
      // Always allow the callback URL
      if (url.startsWith("/api/auth/callback")) {
        return url;
      }
      // Always redirect to dashboard after sign in
      if (url.includes("/sign-in")) {
        return `${baseUrl}/dashboard`;
      }
      // Handle relative URLs
      if (url.startsWith("/")) {
        return `${baseUrl}${url}`;
      }
      // Allow same origin URLs
      if (url.startsWith(baseUrl)) {
        return url;
      }
      return `${baseUrl}/dashboard`;
    },
  },
  events: {
    async signIn({ user }) {
      console.log("User signed in:", user.email);
    },
    async session({ session, token }) {
      console.log("Session update:", session.user.email);
    },
  },
  debug: process.env.NODE_ENV === "development",
  trustHost: true,
});
