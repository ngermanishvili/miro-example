// app/api/tv-series/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
    connectionString: process.env.POSTGRES_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get('page') || '1', 10);
        const limit = parseInt(searchParams.get('limit') || '24', 10);
        const offset = (page - 1) * limit;

        const client = await pool.connect();

        try {
            const query = `
                SELECT 
                    ts.*,
                    COALESCE(json_agg(DISTINCT jsonb_build_object(
                        'id', g.id,
                        'name', g.name
                    )) FILTER (WHERE g.id IS NOT NULL), '[]') as genres,
                    COALESCE(json_agg(DISTINCT jsonb_build_object(
                        'id', cm.id,
                        'name', cm.name,
                        'profile_path', cm.profile_path,
                        'character_name', tsc.character_name
                    )) FILTER (WHERE cm.id IS NOT NULL), '[]') as cast_members
                FROM tv_series ts
                LEFT JOIN tv_series_genres tsg ON ts.id = tsg.tv_series_id
                LEFT JOIN genres g ON g.id = tsg.genre_id
                LEFT JOIN tv_series_cast tsc ON ts.id = tsc.tv_series_id
                LEFT JOIN cast_members cm ON cm.id = tsc.cast_member_id
                GROUP BY ts.id
                LIMIT $1 OFFSET $2;
            `;

            const result = await client.query(query, [limit, offset]);

            // Count total records for pagination
            const countQuery = 'SELECT COUNT(*) FROM tv_series';
            const countResult = await client.query(countQuery);
            const total = parseInt(countResult.rows[0].count);

            client.release();

            return NextResponse.json({
                series: result.rows,
                page,
                limit,
                total,
                hasMore: offset + result.rows.length < total
            });
        } catch (error) {
            client.release();
            console.error('Query error:', error);
            return NextResponse.json({ error: 'Database query failed' }, { status: 500 });
        }
    } catch (error) {
        console.error('Database connection error:', error);
        return NextResponse.json({ error: 'Database connection failed' }, { status: 500 });
    }
}