import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/utils/db';
import { cache } from '@/utils/cache';

// მომდევნო მოთხოვნების ქეშირება, 1 საათი
export const revalidate = 3600;

// Corrected GET method with await for params
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string, locale: string }> }
) {
    try {
        // ვაცადოთ params Promise-ის შესრულება
        // To these lines
        const resolvedParams = await params;
        const { id, locale } = resolvedParams;

        // კეშის გასაღები უნდა შეიცავდეს ლოკალეს ინფორმაციასაც
        const cacheKey = `project_${id}_${locale}`;

        // შევამოწმოთ კეში
        const cachedData = await cache.get(cacheKey);
        if (cachedData) {
            return NextResponse.json(JSON.parse(cachedData));
        }

        let projectData;

        if (locale === 'ka') {
            // ქართული (ძირითადი) მონაცემები
            const result = await query(
                `SELECT id, title, short_description, location, function, area,
                 year, description, floors, images, thumbnail
                 FROM properties WHERE id = $1`,
                [id]
            );

            if (result.rows.length === 0) {
                return NextResponse.json(
                    { error: 'Project not found' },
                    { status: 404 }
                );
            }

            projectData = result.rows[0];
        } else {
            // ლოკალიზებული მონაცემები
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

            projectData = result.rows[0];
        }

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

// პროექტის განახლება (PUT მეთოდი)
export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string, locale: string }> }
) {
    try {
        // ვაცადოთ params Promise-ის შესრულება
        const resolvedParams = await params;
        const { id, locale } = resolvedParams;

        const data = await request.json();

        // პროექტის არსებობის შემოწმება
        const checkResult = await query(
            `SELECT id FROM properties WHERE id = $1`,
            [id]
        );

        if (checkResult.rows.length === 0) {
            return NextResponse.json(
                { error: 'პროექტი ვერ მოიძებნა' },
                { status: 404 }
            );
        }

        // ძირითადი მონაცემების განახლება
        const updateFields = [];
        const updateValues = [];
        let valueIndex = 1;

        for (const [key, value] of Object.entries(data)) {
            // საჭიროა მონაცემების გაფილტვრა, რომ არ მოხდეს უსაფრთხოების პრობლემები
            if (['title', 'short_description', 'location', 'function', 'area', 'year', 'description', 'floors', 'images', 'thumbnail'].includes(key)) {
                updateFields.push(`${key} = $${valueIndex}`);
                updateValues.push(value);
                valueIndex++;
            }
        }

        if (updateFields.length > 0) {
            // ძირითადი ცხრილის განახლება
            await query(
                `UPDATE properties SET ${updateFields.join(', ')} WHERE id = $${valueIndex}`,
                [...updateValues, id]
            );

            // ლოკალიზაციის განახლება, თუ ლოკალე არ არის 'ka'
            if (locale !== 'ka' && (data.title || data.short_description || data.description || data.floors)) {
                const translationExists = await query(
                    `SELECT property_id FROM property_translations WHERE property_id = $1 AND locale = $2`,
                    [id, locale]
                );

                if (translationExists.rows.length > 0) {
                    // განახლება
                    const transUpdateFields = [];
                    const transUpdateValues = [];
                    let transValueIndex = 1;

                    for (const [key, value] of Object.entries(data)) {
                        if (['title', 'short_description', 'description', 'floors'].includes(key)) {
                            transUpdateFields.push(`${key} = $${transValueIndex}`);
                            transUpdateValues.push(value);
                            transValueIndex++;
                        }
                    }

                    if (transUpdateFields.length > 0) {
                        await query(
                            `UPDATE property_translations SET ${transUpdateFields.join(', ')}
                            WHERE property_id = $${transValueIndex} AND locale = $${transValueIndex + 1}`,
                            [...transUpdateValues, id, locale]
                        );
                    }
                } else {
                    // შექმნა
                    await query(
                        `INSERT INTO property_translations (property_id, locale, title, short_description, description, floors)
                        VALUES ($1, $2, $3, $4, $5, $6)`,
                        [
                            id,
                            locale,
                            data.title || null,
                            data.short_description || null,
                            data.description || null,
                            data.floors || null
                        ]
                    );
                }
            }
        }

        return NextResponse.json({
            success: true,
            message: 'პროექტი წარმატებით განახლდა'
        });
    } catch (error) {
        console.error('Database error:', error);
        return NextResponse.json(
            { error: 'პროექტის განახლების შეცდომა' },
            { status: 500 }
        );
    }
}

// პროექტის წაშლა (DELETE მეთოდი)
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string, locale: string }> }
) {
    try {
        // ვაცადოთ params Promise-ის შესრულება
        const resolvedParams = await params;
        const { id } = resolvedParams;

        // ჯერ წავშალოთ თარგმანები
        await query(
            `DELETE FROM property_translations WHERE property_id = $1`,
            [id]
        );

        // შემდეგ წავშალოთ პროექტი
        const result = await query(
            `DELETE FROM properties WHERE id = $1 RETURNING id`,
            [id]
        );

        if (result.rowCount === 0) {
            return NextResponse.json(
                { error: 'პროექტი ვერ მოიძებნა' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            message: 'პროექტი წარმატებით წაიშალა'
        });
    } catch (error) {
        console.error('Database error:', error);
        return NextResponse.json(
            { error: 'პროექტის წაშლის შეცდომა' },
            { status: 500 }
        );
    }
}