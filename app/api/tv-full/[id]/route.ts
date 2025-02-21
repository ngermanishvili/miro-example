import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
    connectionString: process.env.POSTGRES_URL,
    ssl: {
        rejectUnauthorized: false,
    },
});

// Dynamic route handler for GET requests
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    // Await the params to extract the `id`
    const { id } = await params;

    if (!id) {
        return NextResponse.json(
            { error: 'TV series ID is required' },
            { status: 400 }
        );
    }

    try {
        const client = await pool.connect();

        try {
            // Main query for TV series data
            const query = `
                SELECT 
                    ts.*,
                    COALESCE(json_agg(DISTINCT jsonb_build_object(
                        'id', g.id,
                        'name', g.name
                    )) FILTER (WHERE g.id IS NOT NULL), '[]') as genres,
                    COALESCE(json_agg(DISTINCT jsonb_build_object(
                        'id', tpc.id,
                        'name', tpc.name,
                        'logo_path', tpc.logo_path
                    )) FILTER (WHERE tpc.id IS NOT NULL), '[]') as production_companies,
                    COALESCE(json_agg(DISTINCT jsonb_build_object(
                        'id', cm.id,
                        'name', cm.name,
                        'profile_path', cm.profile_path,
                        'character_name', tsc.character_name,
                        'order', tsc.order
                    )) FILTER (WHERE cm.id IS NOT NULL), '[]') as cast_members
                FROM tv_series ts
                LEFT JOIN tv_series_genres tsg ON ts.id = tsg.tv_series_id
                LEFT JOIN genres g ON g.id = tsg.genre_id
                LEFT JOIN tv_series_production_companies tspc ON ts.id = tspc.tv_series_id
                LEFT JOIN production_companies tpc ON tpc.id = tspc.company_id
                LEFT JOIN tv_series_cast tsc ON ts.id = tsc.tv_series_id
                LEFT JOIN cast_members cm ON cm.id = tsc.cast_member_id
                WHERE ts.id = $1
                GROUP BY ts.id;
            `;

            const result = await client.query(query, [id]);

            if (result.rows.length === 0) {
                return NextResponse.json(
                    { error: 'TV series not found' },
                    { status: 404 }
                );
            }

            // Format the response
            const show = {
                ...result.rows[0],
                genres: result.rows[0].genres || [],
                cast_members: result.rows[0].cast_members || [],
                production_companies: result.rows[0].production_companies || [],
            };

            return NextResponse.json(show, {
                headers: {
                    'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
                },
            });

        } catch (error) {
            console.error('Query error:', error);
            return NextResponse.json(
                { error: 'Database query failed' },
                { status: 500 }
            );
        } finally {
            client.release();
        }
    } catch (error) {
        console.error('Database connection error:', error);
        return NextResponse.json(
            { error: 'Database connection failed' },
            { status: 500 }
        );
    }
}
