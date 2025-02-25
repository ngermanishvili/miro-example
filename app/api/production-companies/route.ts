// app/api/production-companies/route.ts
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

// ყველაზე პოპულარული კომპანიების მიღება, რომლებსაც აქვთ მინიმუმ 1 ფილმი
const getPopularCompanies = unstable_cache(
    async () => {
        const client = await pool.connect();

        try {
            // ძირითადი შეკითხვა
            const query = `
                SELECT 
                    pc.id,
                    pc.name,
                    pc.logo_path,
                    COUNT(DISTINCT mpc.movie_id) as movie_count
                FROM 
                    production_companies pc
                JOIN 
                    movie_production_companies mpc ON pc.id = mpc.company_id
                JOIN
                    movies m ON m.id = mpc.movie_id
                WHERE
                    (m.backdrop_poster_url IS NOT NULL OR m.backdrop_path_tmdb IS NOT NULL)
                GROUP BY 
                    pc.id, pc.name, pc.logo_path
                HAVING 
                    COUNT(DISTINCT mpc.movie_id) > 0
                ORDER BY 
                    movie_count DESC
                LIMIT 20
            `;

            const result = await client.query(query);
            logger.debug(`ნაპოვნია ${result.rows.length} კომპანია`);

            return result.rows;
        } catch (error) {
            logger.error('შეცდომა კომპანიების მიღებისას:', error);
            throw error;
        } finally {
            client.release();
        }
    },
    ['production-companies'],
    {
        revalidate: 3600, // 1 საათი
        tags: ['companies']
    }
);

// API მარშრუტი
export async function GET(request: NextRequest) {
    try {
        const companies = await getPopularCompanies();

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
        revalidateTag('companies');
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