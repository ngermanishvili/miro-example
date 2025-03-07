//app/[locale]/api/auth/login/route.ts
import { query } from "@/lib/db";
import { NextResponse } from "next/server";
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
        const body: LoginRequest = await request.json();
        const { username, password } = body;

        if (!username || !password) {
            return NextResponse.json(
                { status: "error", message: "შეიყვანეთ მომხმარებელი და პაროლი" },
                { status: 400 }
            );
        }

        // PostgreSQL-ის სინტაქსით - შევცვალეთ query რომ არ მოითხოვოს is_active
        const users = await query(
            `SELECT * FROM admin WHERE username = $1`,
            [username]
        );

        if (!users.length) {
            return NextResponse.json(
                { status: "error", message: "მომხმარებელი ვერ მოიძებნა" },
                { status: 401 }
            );
        }

        const user = users[0] as AdminUser;

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