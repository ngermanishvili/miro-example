import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
import createIntlMiddleware from 'next-intl/middleware';
import { routing } from './src/i18n/routing';

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

// Add the check endpoint to public APIs
const PUBLIC_APIS = [
    '/api/projects',
    '/api/auth/login',
    '/api/auth/check',
    '/api/direct-insert',
    '/api/case-login',


    // დებაგ ენდპოინტები (დაამატეთ)
    '/api/check-admin',
    '/api/test-login',
    '/api/direct-setup',
    '/api/public-setup',
    '/api/create-admin',
    '/api/password-hash',
    '/api/admin-setup'
];

const intlMiddleware = createIntlMiddleware({
    ...routing,
    localePrefix: "always",
    defaultLocale: 'en',
    locales: ['en', 'ka', 'ru']
});

export async function middleware(request) {
    const path = request.nextUrl.pathname;

    // For root path, redirect to default locale
    if (path === '/') {
        return NextResponse.redirect(new URL('/en', request.url));
    }

    // Handle API routes
    if (path.startsWith('/api/')) {
        // Check if this is a public API that doesn't need authentication
        const isPublicApi = PUBLIC_APIS.some(api => path.startsWith(api));
        if (isPublicApi) {
            return NextResponse.next();
        }

        // For protected API routes, verify the auth token
        try {
            const token = request.cookies.get('auth_token')?.value;
            if (!token) {
                return NextResponse.json({ status: "error", message: "ავტორიზაცია საჭიროა" }, { status: 401 });
            }

            await jwtVerify(token, new TextEncoder().encode(JWT_SECRET));
            return NextResponse.next();
        } catch (error) {
            console.error('API auth error:', error);
            return NextResponse.json({ status: "error", message: "ავტორიზაცია არავალიდურია" }, { status: 401 });
        }
    }

    // Handle admin routes
    if (path.startsWith('/admin/')) {
        try {
            const token = request.cookies.get('auth_token')?.value;
            if (!token) {
                return NextResponse.redirect(new URL('/en/login', request.url));
            }

            await jwtVerify(token, new TextEncoder().encode(JWT_SECRET));
            return NextResponse.next();
        } catch (error) {
            console.error('Admin auth error:', error);
            return NextResponse.redirect(new URL('/en/login', request.url));
        }
    }

    // Prevent double locale prefixing
    const hasLocalePrefix = routing.locales.some(locale =>
        path.startsWith(`/${locale}/${locale}`)
    );

    if (hasLocalePrefix) {
        // Remove double locale prefix
        const segments = path.split('/');
        const correctedPath = `/${segments[1]}/${segments.slice(3).join('/')}`;
        return NextResponse.redirect(new URL(correctedPath, request.url));
    }

    // Use next-intl middleware for all other routes
    return intlMiddleware(request);
}

export const config = {
    matcher: [
        '/',
        '/((?!_next|_vercel|static|favicon|.*\\..*).*)',
        '/admin/:path*',
        '/api/:path*'
    ]
};