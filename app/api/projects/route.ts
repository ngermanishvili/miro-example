// app/[locale]/api/projects/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getPool } from '@/utils/db';

// GET მეთოდი - პროექტების სიის მისაღებად
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

            return NextResponse.json({ projects: formattedProjects });
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

// POST მეთოდი - ახალი პროექტის დასამატებლად
export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ locale: string }> }
) {
    try {
        const resolvedParams = await params;
        const locale = resolvedParams.locale;

        const data = await request.json();
        const {
            title,
            short_description,
            location,
            function: projectFunction,
            area,
            year
        } = data;

        // შევამოწმოთ აუცილებელი ველები
        if (!title || title.trim() === '') {
            return NextResponse.json(
                { error: 'პროექტის სათაური აუცილებელია' },
                { status: 400 }
            );
        }

        const pool = getPool();
        const client = await pool.connect();

        try {
            // ტრანზაქციის დაწყება
            await client.query('BEGIN');

            // ახალი პროექტის შექმნა
            const result = await client.query(
                `INSERT INTO properties 
                (title, short_description, location, function, area, year) 
                VALUES ($1, $2, $3, $4, $5, $6) 
                RETURNING *`,
                [title, short_description, location, projectFunction, area, year]
            );

            const newProject = result.rows[0];

            // თუ locale არ არის 'ka', დავამატოთ თარგმანი
            if (locale !== 'ka') {
                await client.query(
                    `INSERT INTO property_translations 
                    (property_id, locale, title, short_description) 
                    VALUES ($1, $2, $3, $4)`,
                    [newProject.id, locale, title, short_description]
                );
            }

            // ტრანზაქციის დასრულება
            await client.query('COMMIT');

            // მოვამზადოთ პასუხი
            const formattedProject = {
                id: newProject.id,
                title: newProject.title,
                shortDescription: newProject.short_description,
                location: newProject.location,
                function: newProject.function,
                area: newProject.area,
                year: newProject.year,
                description: Array.isArray(newProject.description) ? newProject.description : [],
                floors: Array.isArray(newProject.floors) ? newProject.floors : [],
                images: Array.isArray(newProject.images) ? newProject.images : [],
                thumbnail: newProject.thumbnail
            };

            return NextResponse.json({
                success: true,
                message: 'პროექტი წარმატებით დაემატა',
                project: formattedProject
            });

        } catch (error) {
            // შეცდომის შემთხვევაში ტრანზაქციის გაუქმება
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    } catch (error) {
        console.error('Database error:', error);
        return NextResponse.json(
            { error: 'პროექტის დამატების შეცდომა' },
            { status: 500 }
        );
    }
}