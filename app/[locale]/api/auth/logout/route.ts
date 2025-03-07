import { NextResponse } from 'next/server';

import { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        const response = NextResponse.json({
            status: "success",
            message: "წარმატებით გამოხვედით სისტემიდან"
        });

        // ვშლით auth_token-ს
        response.cookies.delete('auth_token');

        return response;
    } catch (error) {
        console.error('Logout error:', error);
        return NextResponse.json(
            { status: "error", message: "შეცდომა სისტემიდან გამოსვლისას" },
            { status: 500 }
        );
    }
}