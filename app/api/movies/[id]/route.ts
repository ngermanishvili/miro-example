import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
    connectionString: process.env.POSTGRES_URL,
    ssl: { rejectUnauthorized: false }
});

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    const { id } = await params; // Await params

    if (!id) {
        return NextResponse.json(
            { error: 'Movie ID is required' },
            { status: 400 }
        );
    }

    try {
        const client = await pool.connect();

        try {
            const query = `
                SELECT 
                    m.*,
                    COALESCE(json_agg(DISTINCT jsonb_build_object(
                        'id', cm.id,
                        'name', cm.name,
                        'profile_path', cm.profile_path,
                        'character_name', mc.character_name,
                        'order', mc.order
                    )) FILTER (WHERE cm.id IS NOT NULL), '[]') as cast_members
                FROM movies m
                LEFT JOIN movie_cast mc ON m.id = mc.movie_id
                LEFT JOIN cast_members cm ON cm.id = mc.cast_member_id
                WHERE m.id = $1
                GROUP BY m.id;
            `;

            const result = await client.query(query, [id]);

            if (result.rows.length === 0) {
                return NextResponse.json(
                    { error: 'Movie not found' },
                    { status: 404 }
                );
            }

            return NextResponse.json({
                ...result.rows[0],
                cast_members: result.rows[0].cast_members
            }, {
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