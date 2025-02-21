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
    try {
        // Await the params to extract the `id`
        const { id } = await params;

        // Connect to the database
        const client = await pool.connect();

        try {
            // Query to fetch a single TV series by ID, including genres and cast members
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
        WHERE ts.id = $1
        GROUP BY ts.id;
      `;

            // Execute the query with the provided ID
            const result = await client.query(query, [id]);
            client.release();

            // If no TV series is found, return a 404 response
            if (result.rows.length === 0) {
                return NextResponse.json({ error: 'TV series not found' }, { status: 404 });
            }

            // Return the TV series data as JSON
            return NextResponse.json(result.rows[0]);
        } catch (error) {
            client.release();
            console.error('Query error:', error);
            return NextResponse.json({ error: 'Database query failed' }, { status: 500 });
        }
    } catch (error) {
        console.error('Error:', error);
        return NextResponse.json({ error: 'Failed to process request' }, { status: 500 });
    }
}
