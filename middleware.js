import { NextResponse } from 'next/server';
import createIntlMiddleware from 'next-intl/middleware';
import { routing } from './src/i18n/routing';


const intlMiddleware = createIntlMiddleware({
    ...routing,
    localePrefix: "always",  // Changed to "always" for consistent behavior
    defaultLocale: 'ka',
    locales: ['ka', 'en', 'ru']
});

export async function middleware(request) {
    const path = request.nextUrl.pathname;

    // For root path, redirect to default locale
    if (path === '/') {
        return NextResponse.redirect(new URL('/ka', request.url));
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
        '/((?!api|_next|_vercel|static|favicon|.*\\..*).*)',
        '/admin/:path*',
        '/api/:path*',
        '/login'
    ]
};
