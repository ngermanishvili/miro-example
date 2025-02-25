// app/api/tv-production-companies/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';
import { unstable_cache } from 'next/cache';

// გლობალური კონექშენის პული
const pool = new Pool({
    connectionString: process.env.POSTGRES_URL,
    ssl: { rejectUnauthorized: false },
    max: 10,
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

// ყველაზე პოპულარული კომპანიების მიღება, რომლებსაც აქვთ მინიმუმ 1 სერიალი
const getPopularTVCompanies = unstable_cache(
    async () => {
        const client = await pool.connect();

        try {
            // ძირითადი შეკითხვა
            const query = `
                SELECT 
                    pc.id,
                    pc.name,
                    pc.logo_path,
                    COUNT(DISTINCT tspc.tv_series_id) as series_count
                FROM 
                    production_companies pc
                JOIN 
                    tv_series_production_companies tspc ON pc.id = tspc.company_id
                JOIN
                    tv_series ts ON ts.id = tspc.tv_series_id
                WHERE
                    (ts.backdrop_poster_url IS NOT NULL OR ts.backdrop_path_tmdb IS NOT NULL)
                GROUP BY 
                    pc.id, pc.name, pc.logo_path
                HAVING 
                    COUNT(DISTINCT tspc.tv_series_id) > 0
                ORDER BY 
                    series_count DESC
                LIMIT 20
            `;

            const result = await client.query(query);
            logger.debug(`ნაპოვნია ${result.rows.length} სერიალების კომპანია`);

            return result.rows;
        } catch (error) {
            logger.error('შეცდომა სერიალების კომპანიების მიღებისას:', error);
            throw error;
        } finally {
            client.release();
        }
    },
    ['tv-production-companies'],
    {
        revalidate: 3600, // 1 საათი
        tags: ['tv-companies']
    }
);

// API მარშრუტი
export async function GET(request: NextRequest) {
    try {
        const companies = await getPopularTVCompanies();

        return NextResponse.json({
            companies,
            count: companies.length
        }, {
            headers: {
                'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
            }
        });
    } catch (error) {
        logger.error('შეცდომა API-ში:', error);
        return NextResponse.json(
            { error: 'შიდა სერვერის შეცდომა' },
            { status: 500 }
        );
    }
}

// ქეშის რევალიდაცია
export async function POST(request: NextRequest) {
    try {
        const { revalidateTag } = await import('next/cache');
        revalidateTag('tv-companies');
        return NextResponse.json({
            revalidated: true,
            now: Date.now()
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