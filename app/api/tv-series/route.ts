// app/api/tv-series/route.ts
import { NextResponse } from 'next/server';
import { Pool } from 'pg';
import { unstable_cache } from 'next/cache';

const pool = new Pool({
    connectionString: process.env.POSTGRES_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

// Cache key generator
const getCacheKey = (page: number, limit: number) => `tv-series-${page}-${limit}`;

// Cached query function
const fetchTVSeries = unstable_cache(
    async (page: number, limit: number) => {
        const offset = (page - 1) * limit;
        const client = await pool.connect();

        try {
            const query = `
        SELECT 
          ts.id,
          ts.title_geo,
          ts.title_eng,
          ts.imdb_vote,
          ts.backdrop_poster_url,
          ts.backdrop_path_tmdb,
          ts.release_date,
          ts.poster_logo::jsonb as poster_logo
        FROM tv_series ts
        WHERE ts.backdrop_poster_url IS NOT NULL
        OR ts.backdrop_path_tmdb IS NOT NULL
        ORDER BY ts.id DESC
        LIMIT $1 OFFSET $2;
      `;

            console.log('Executing query:', query);
            const result = await client.query(query, [limit, offset]);
            console.log('Query result:', result.rows);

            return result.rows;
        } finally {
            client.release();
        }
    },
    ['tv-series'], // Cache tag
    {
        revalidate: 3600, // Revalidate every hour
        tags: ['tv-series']
    }
);

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '20');

        // Fetch data using cached function
        const series = await fetchTVSeries(page, limit);

        // Return response with cache headers
        return NextResponse.json(
            {
                series,
                page,
                limit,
                hasMore: series.length === limit
            },
            {
                headers: {
                    'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400'
                }
            }
        );
    } catch (error) {
        console.error('Database error:', error);
        return NextResponse.json(
            { error: 'Internal Server Error', details: error },
            { status: 500 }
        );
    }
}