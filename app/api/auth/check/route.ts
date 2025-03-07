// app/api/auth/check/route.ts
import { jwtVerify } from 'jose';
import { NextResponse } from 'next/server';
import { query } from "@/lib/db";

// Mark this route as dynamic
export const dynamic = 'force-dynamic';

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

interface CustomJWTPayload {
    userId: number;
    username: string;
}

interface AdminUser {
    admin_id: number;
    username: string;
}

export async function GET(request: Request) {
    try {
        const cookies = request.headers.get('cookie');
        if (!cookies) {
            return NextResponse.json(
                { status: "error", message: "ტოკენი ვერ მოიძებნა" },
                { status: 401 }
            );
        }

        // ვიპოვოთ auth_token ქუქიში
        const tokenCookie = cookies
            .split(';')
            .map(cookie => cookie.trim())
            .find(cookie => cookie.startsWith('auth_token='));

        if (!tokenCookie) {
            return NextResponse.json(
                { status: "error", message: "ტოკენი ვერ მოიძებნა" },
                { status: 401 }
            );
        }

        const token = tokenCookie.split('=')[1];

        // ტოკენის ვერიფიკაცია
        const { payload } = await jwtVerify(
            token,
            new TextEncoder().encode(JWT_SECRET)
        );

        // მოვახდინოთ უსაფრთხო კასტინგი
        const jwtPayload = payload as unknown as CustomJWTPayload;

        const users = await query(
            `SELECT admin_id, username FROM admin WHERE admin_id = $1`,
            [jwtPayload.userId]
        );

        if (!users.length) {
            return NextResponse.json(
                { status: "error", message: "მომხმარებელი აღარ არსებობს" },
                { status: 401 }
            );
        }

        const user = users[0] as AdminUser;

        // ვაბრუნებთ მომხმარებლის ინფორმაციას
        return NextResponse.json({
            status: "success",
            user: {
                userId: user.admin_id,
                username: user.username
            }
        });
    } catch (error: any) {
        console.error('Token verification error:', error);
        return NextResponse.json(
            { status: "error", message: "ტოკენი არავალიდურია" },
            { status: 401 }
        );
    }
}