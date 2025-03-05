
// app/[locale]/api/projects/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getPool } from '@/utils/db';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ locale: string }> }
) {
    try {
        // Next.js 15-ში API route-ებშიც params არის Promise
        const resolvedParams = await params;
        const locale = resolvedParams.locale;

        const pool = getPool();
        const client = await pool.connect();

        try {
            // ლოკალიზებული მონაცემების მიღება ყველა ლოკალისთვის (ქართულის ჩათვლით)
            const result = await client.query(`
                SELECT
                    p.id,
                    COALESCE(pt.title, p.title) as title,
                    COALESCE(pt.short_description, p.short_description) as short_description,
                    p.location, 
                    p.function, 
                    p.area,
                    p.year,
                    COALESCE(pt.description, p.description) as description,
                    COALESCE(pt.floors, p.floors) as floors,
                    p.images, 
                    p.thumbnail
                FROM properties p
                LEFT JOIN property_translations pt
                    ON p.id = pt.property_id AND pt.locale = $1
            `, [locale]);

            const projects = result.rows;

            // JSON ველების გადამუშავება JavaScript ობიექტებად
            const formattedProjects = projects.map(row => ({
                id: row.id,
                title: row.title,
                shortDescription: row.short_description,
                location: row.location,
                function: row.function,
                area: row.area,
                year: row.year,
                description: Array.isArray(row.description) ? row.description : [],
                floors: Array.isArray(row.floors) ? row.floors : [],
                images: Array.isArray(row.images) ? row.images : [],
                thumbnail: row.thumbnail
            }));

            return NextResponse.json(formattedProjects);
        } finally {
            client.release();
        }
    } catch (error) {
        console.error('Database error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch projects' },
            { status: 500 }
        );
    }
}