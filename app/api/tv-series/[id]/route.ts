// app/api/tv-series/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';
import { unstable_cache } from 'next/cache';

// გლობალური კონექშენის პული
const pool = new Pool({
    connectionString: process.env.POSTGRES_URL,
    ssl: {
        rejectUnauthorized: false,
    },
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000
});

// ლოგერის ფუნქცია
const logger = {
    debug: (message: string, data?: any) => {
        if (process.env.NODE_ENV !== 'production') console.log(message, data);
    },
    error: (message: string, error: any) => console.error(message, error)
};

// სერიალის დეტალების მიღება - კეშირებული ფუნქცია
const getTVSeriesDetails = unstable_cache(
    async (id: string) => {
        logger.debug(`მოითხოვება სერიალის დეტალები ID: ${id}`);
        const client = await pool.connect();

        try {
            // მთავარი შეკითხვა სერიალის მონაცემების მისაღებად
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
                logger.debug(`სერიალი ვერ მოიძებნა ID: ${id}`);
                return null;
            }

            // მსახიობების დალაგება order-ის მიხედვით და ტოპ 20-ის არჩევა
            const castMembers = result.rows[0].cast_members || [];
            const sortedCastMembers = castMembers
                .filter((member: any) => member.id !== null)
                .sort((a: any, b: any) => {
                    const orderA = a.order !== undefined && a.order !== null ? a.order : 999;
                    const orderB = b.order !== undefined && b.order !== null ? b.order : 999;
                    return orderA - orderB;
                })
                .slice(0, 20);

            // შედეგების ფორმატირება
            const show = {
                ...result.rows[0],
                genres: result.rows[0].genres || [],
                cast_members: sortedCastMembers,
                production_companies: result.rows[0].production_companies || [],
            };

            logger.debug(`სერიალის დეტალები წარმატებით მოიძებნა ID: ${id}`);
            return show;
        } catch (error) {
            logger.error(`შეკითხვის შეცდომა სერიალისთვის ID: ${id}`, error);
            throw error;
        } finally {
            client.release();
        }
    },
    ['tv-series-details']
);

// დინამიური მარშრუტის დამმუშავებელი GET მოთხოვნებისთვის
export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    const { id } = params;

    if (!id) {
        return NextResponse.json(
            { error: 'სერიალის ID აუცილებელია' },
            { status: 400 }
        );
    }

    try {
        const showDetails = await getTVSeriesDetails(id);

        if (!showDetails) {
            return NextResponse.json(
                { error: 'სერიალი ვერ მოიძებნა' },
                { status: 404 }
            );
        }

        return NextResponse.json(showDetails, {
            headers: {
                'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
            },
        });
    } catch (error) {
        logger.error('მონაცემთა ბაზის შეცდომა:', error);
        return NextResponse.json(
            { error: 'შიდა სერვერის შეცდომა' },
            { status: 500 }
        );
    }
}

// ქეშის ინვალიდაციისთვის POST მეთოდი
export async function POST(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    const { id } = params;

    try {
        const { revalidateTag } = await import('next/cache');

        // კონკრეტული სერიალის ტეგის რევალიდაცია
        revalidateTag(`tv-series-${id}`);

        return NextResponse.json({
            revalidated: true,
            now: Date.now(),
            message: `სერიალის ID: ${id} ქეში წარმატებით განახლდა`
        });
    } catch (error) {
        return NextResponse.json({
            revalidated: false,
            error: (error as Error).message
        }, {
            status: 500
        });
    }
}