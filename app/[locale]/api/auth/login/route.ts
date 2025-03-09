// app/[locale]/api/auth/login/route.ts
import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb"; // ეს შეცვალეთ თქვენი MongoDB კავშირის მიხედვით
import crypto from 'crypto';
import { SignJWT } from 'jose';

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

interface LoginRequest {
    username: string;
    password: string;
}

interface AdminUser {
    admin_id: number;
    username: string;
    password: string;
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { username, password } = body;

        console.log("Login attempt:", username);

        if (!username || !password) {
            return NextResponse.json(
                { status: "error", message: "შეიყვანეთ მომხმარებელი და პაროლი" },
                { status: 400 }
            );
        }

        // MongoDB-სთან დაკავშირება
        console.log("Connecting to MongoDB...");
        const { db } = await connectToDatabase();
        console.log("Connected to MongoDB");

        // მომხმარებლის მოძებნა
        console.log("Searching for user:", username);
        const usersCollection = db.collection("admin");
        const collectionsCount = await db.listCollections({ name: "admin" }).toArray();
        console.log("Admin collection exists:", collectionsCount.length > 0);

        const user = await usersCollection.findOne({ username });
        console.log("User found:", user ? "Yes" : "No");

        if (!user) {
            return NextResponse.json(
                { status: "error", message: "მომხმარებელი ვერ მოიძებნა" },
                { status: 401 }
            );
        }

        // პაროლის შემოწმება (SHA-256 ჰეშირებით)
        const hashedPassword: string = crypto
            .createHash('sha256')
            .update(password)
            .digest('hex');

        const isValidPassword: boolean = user.password === hashedPassword;

        if (!isValidPassword) {
            return NextResponse.json(
                { status: "error", message: "არასწორი პაროლი" },
                { status: 401 }
            );
        }

        // ტოკენის შექმნა
        const token: string = await new SignJWT({
            userId: user.admin_id,
            username: user.username
        })
            .setProtectedHeader({ alg: 'HS256' })
            .setIssuedAt()
            .setExpirationTime('24h')
            .sign(new TextEncoder().encode(JWT_SECRET));

        const response = NextResponse.json({
            status: "success",
            message: "წარმატებული ავტორიზაცია"
        });

        // ქუქის დაყენება
        response.cookies.set({
            name: 'auth_token',
            value: token,
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
            maxAge: 86400 // 24 საათი
        });

        return response;
    } catch (error: any) {
        console.error('Login error:', error);

        const errorMessage: string = process.env.NODE_ENV === 'development'
            ? `სისტემური შეცდომა: ${error.message}`
            : "სისტემური შეცდომა";

        return NextResponse.json(
            { status: "error", message: errorMessage },
            { status: 500 }
        );
    }
}