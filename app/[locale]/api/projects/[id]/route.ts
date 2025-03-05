// app/[locale]/api/projects/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/utils/db';
import { cache } from '@/utils/cache';

// მომდევნო მოთხოვნების ქეშირება, 1 საათი
export const revalidate = 3600;

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string, locale: string }> }
) {
    try {
        const resolvedParams = await params;
        const id = resolvedParams.id;
        const locale = resolvedParams.locale;

        // კეშის გასაღები უნდა შეიცავდეს ლოკალეს ინფორმაციასაც
        const cacheKey = `project_${id}_${locale}`;

        // შევამოწმოთ კეში
        const cachedData = await cache.get(cacheKey);
        if (cachedData) {
            return NextResponse.json(JSON.parse(cachedData));
        }

        // ლოკალიზებული მონაცემები ყველა ლოკალისთვის (ქართულის ჩათვლით)
        const result = await query(
            `SELECT
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
            WHERE p.id = $2`,
            [locale, id]
        );

        if (result.rows.length === 0) {
            return NextResponse.json(
                { error: 'Project not found' },
                { status: 404 }
            );
        }

        const projectData = result.rows[0];

        // პროექტის ობიექტის შექმნა
        const project = {
            id: projectData.id,
            title: projectData.title,
            shortDescription: projectData.short_description,
            location: projectData.location,
            function: projectData.function,
            area: projectData.area,
            year: projectData.year,
            description: Array.isArray(projectData.description) ? projectData.description : [],
            floors: Array.isArray(projectData.floors) ? projectData.floors : [],
            images: Array.isArray(projectData.images) ? projectData.images : [],
            thumbnail: projectData.thumbnail
        };

        // შევინახოთ კეშში მომავალი მოთხოვნებისთვის
        await cache.set(cacheKey, JSON.stringify(project), { ttl: 3600 });

        return NextResponse.json(project);
    } catch (error) {
        console.error('Database error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch project' },
            { status: 500 }
        );
    }
}
