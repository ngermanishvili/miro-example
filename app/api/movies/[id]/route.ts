import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
    connectionString: process.env.POSTGRES_URL,
    ssl: { rejectUnauthorized: false }
});

// Fixed type definition for the GET handler
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        // Awaiting params to get the movie ID
        const { id } = await params;

        if (!id) {
            return NextResponse.json(
                { error: 'Movie ID is required' },
                { status: 400 }
            );
        }

        console.log(`Fetching movie with ID: ${id}`);

        const client = await pool.connect();

        try {
            const query = `
                SELECT 
                    m.*,
                    (homepage::jsonb)->>'url' as homepage_url
                FROM public.movies m
                WHERE m.id = $1
            `;

            const result = await client.query(query, [id]);

            if (result.rows.length === 0) {
                return NextResponse.json(
                    { error: 'Movie not found' },
                    { status: 404 }
                );
            }

            const movie = result.rows[0];

            // Fetch additional movie data (like production companies, etc.) if needed
            const companiesQuery = `
                SELECT 
                    pc.id,
                    pc.name,
                    pc.logo_path,
                    pc.origin_country
                FROM movie_production_companies mpc
                JOIN production_companies pc ON mpc.company_id = pc.id
                WHERE mpc.movie_id = $1
            `;

            const companiesResult = await client.query(companiesQuery, [id]);
            movie.production_companies = companiesResult.rows;

            return NextResponse.json(movie, {
                headers: { 'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400' }
            });
        } finally {
            client.release();
        }
    } catch (error) {
        console.error('Database error:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
