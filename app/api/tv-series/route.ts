import { NextResponse } from 'next/server';
import { Pool } from 'pg';
import { unstable_cache } from 'next/cache';

const pool = new Pool({
    connectionString: process.env.POSTGRES_URL,
    ssl: { rejectUnauthorized: false }
});

const fetchTVSeries = unstable_cache(
    async (page: number, limit: number, companies: string | null, platform: string | null) => {
        const offset = (page - 1) * limit;
        const client = await pool.connect();

        try {
            let query = `
                SELECT DISTINCT ON (ts.id)
                    ts.id,
                    ts.title_geo,
                    ts.title_eng,
                    ts.imdb_vote,
                    ts.backdrop_poster_url,
                    ts.backdrop_path_tmdb,
                    ts.release_date,
                    ts.poster_logo::jsonb as poster_logo,
                    (homepage::jsonb)->>'url' as homepage_url
                FROM tv_series ts
                LEFT JOIN tv_series_production_companies tspc ON ts.id = tspc.tv_series_id
                LEFT JOIN production_companies tpc ON tpc.id = tspc.company_id
                WHERE (ts.backdrop_poster_url IS NOT NULL OR ts.backdrop_path_tmdb IS NOT NULL)
            `;

            const queryParams: any[] = [limit, offset];
            let paramIndex = 3;
            const conditions: string[] = [];

            if (companies) {
                conditions.push(`tpc.id = ANY($${paramIndex}::int[])`);
                queryParams.push(companies.split(',').map(Number));
                paramIndex++;
            }

            if (platform) {
                conditions.push(`(homepage::jsonb)->>'url' ILIKE $${paramIndex}`);
                queryParams.push(`%${platform}%`);
                paramIndex++;
            }

            if (conditions.length > 0) {
                query += ` AND (${conditions.join(' OR ')})`;
            }

            query += `
                ORDER BY ts.id DESC
                LIMIT $1 OFFSET $2
            `;

            const result = await client.query(query, queryParams);
            return result.rows;
        } finally {
            client.release();
        }
    },
    ['tv-series'],
    { revalidate: 3600, tags: ['tv-series'] }
);

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '8');
        const companies = searchParams.get('companies');
        const platform = searchParams.get('platform');

        const series = await fetchTVSeries(page, limit, companies, platform);

        return NextResponse.json({
            series,
            page,
            limit,
            hasMore: series.length >= limit
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