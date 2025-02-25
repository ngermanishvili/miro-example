import { NextResponse } from 'next/server';
import { Pool } from 'pg';
import { unstable_cache } from 'next/cache';

const pool = new Pool({
    connectionString: process.env.POSTGRES_URL,
    ssl: { rejectUnauthorized: false }
});

const fetchMovies = unstable_cache(
    async (page: number, limit: number, companies: string | null, platform: string | null) => {
        const offset = (page - 1) * limit;
        const client = await pool.connect();

        try {
            // Use the exact same query structure as the TV series, just with different table names
            let query = `
                SELECT DISTINCT ON (m.id)
                    m.id,
                    m.title_geo,
                    m.title_eng,
                    m.imdb_vote,
                    m.backdrop_poster_url,
                    m.backdrop_path_tmdb,
                    m.release_date,
                    (homepage::jsonb)->>'url' as homepage_url
                FROM public.movies m
                LEFT JOIN movie_production_companies mpc ON m.id = mpc.movie_id
                LEFT JOIN production_companies pc ON pc.id = mpc.company_id
                WHERE (m.backdrop_poster_url IS NOT NULL OR m.backdrop_path_tmdb IS NOT NULL)
            `;

            const queryParams: any[] = [limit, offset];
            let paramIndex = 3;
            const conditions: string[] = [];

            // Match TV series condition structure exactly
            if (companies) {
                console.log(`Processing companies: ${companies}`);
                conditions.push(`pc.id = ANY($${paramIndex}::int[])`);
                queryParams.push(companies.split(',').map(Number));
                paramIndex++;
            }

            if (platform) {
                console.log(`Processing platform: ${platform}`);
                conditions.push(`(homepage::jsonb)->>'url' ILIKE $${paramIndex}`);
                queryParams.push(`%${platform}%`);
                paramIndex++;
            }

            if (conditions.length > 0) {
                query += ` AND (${conditions.join(' OR ')})`;
            }

            query += `
                ORDER BY m.id DESC
                LIMIT $1 OFFSET $2
            `;

            console.log("Query:", query);
            console.log("Query params:", queryParams);

            const result = await client.query(query, queryParams);
            console.log(`Found ${result.rows.length} movies`);

            // If no rows, do a test query to see if there are any movies with this platform
            if (result.rows.length === 0 && platform) {
                const testQuery = `
                    SELECT count(*) as count, (homepage::jsonb)->>'url' as url
                    FROM public.movies 
                    WHERE (homepage::jsonb)->>'url' ILIKE $1
                    GROUP BY (homepage::jsonb)->>'url'
                `;
                const testResult = await client.query(testQuery, [`%${platform}%`]);
                console.log(`Test query for platform ${platform}:`, testResult.rows);
            }

            return result.rows;
        } finally {
            client.release();
        }
    },
    ['movies'],
    { revalidate: 3600, tags: ['movies'] }
);

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '8');
        const companies = searchParams.get('companies');
        const platform = searchParams.get('platform');

        console.log("Movies API called with params:", { page, limit, companies, platform });

        const movies = await fetchMovies(page, limit, companies, platform);

        // Important: Return with the same structure as TV shows - 'movies' instead of 'series'
        return NextResponse.json({
            movies,
            page,
            limit,
            hasMore: movies.length >= limit
        }, {
            headers: { 'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400' }
        });
    } catch (error) {
        console.error('Database error:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}