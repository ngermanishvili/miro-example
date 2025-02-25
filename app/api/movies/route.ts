// app/api/movies/route.ts - გამოსწორებული ვერსია
import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';
import { unstable_cache } from 'next/cache';
import { revalidateTag } from 'next/cache';

// გლობალური კონექშენის პული
const pool = new Pool({
    connectionString: process.env.POSTGRES_URL,
    ssl: { rejectUnauthorized: false },
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

// ოპტიმიზირებული ფილმების შეკითხვა
async function executeMovieQuery(
    page: number,
    limit: number,
    companies: string | null,
    platform: string | null
) {
    const offset = (page - 1) * limit;
    const client = await pool.connect();

    try {
        // ოპტიმიზირებული შეკითხვა, რომელიც გაითვალისწინებს homepage-ის სხვადასხვა ფორმატებს
        let query = `
            SELECT DISTINCT ON (m.id)
                m.id,
                m.title_geo,
                m.title_eng,
                m.imdb_vote,
                m.backdrop_poster_url,
                m.backdrop_path_tmdb,
                m.release_date,
                CASE 
                    WHEN m.homepage ~ '^https?://' THEN m.homepage
                    WHEN m.homepage ~ '^{.*"url"\\s*:\\s*"https?://.*}$' AND 
                         (m.homepage::text IS NOT NULL) AND 
                         (m.homepage::text != '{}') 
                    THEN
                        (m.homepage::json->>'url')::text
                    ELSE NULL
                END AS homepage_url
            FROM public.movies m
            LEFT JOIN movie_production_companies mpc ON m.id = mpc.movie_id
            LEFT JOIN production_companies pc ON pc.id = mpc.company_id
            WHERE (m.backdrop_poster_url IS NOT NULL OR m.backdrop_path_tmdb IS NOT NULL)
        `;

        const queryParams: any[] = [];
        let paramIndex = 1;
        const conditions: string[] = [];

        // ფილტრაცია პროდაქშენ კომპანიების მიხედვით
        if (companies) {
            logger.debug(`დამუშავდა კომპანიები: ${companies}`);

            // თუ მრავალი კომპანიაა გადმოცემული (მძიმით გამოყოფილი)
            if (companies.includes(',')) {
                const companyIds = companies.split(',').map(id => parseInt(id.trim()));
                conditions.push(`pc.id = ANY($${paramIndex}::int[])`);
                queryParams.push(companyIds);
            } else {
                // თუ ერთი კომპანიაა
                conditions.push(`pc.id = $${paramIndex}::int`);
                queryParams.push(parseInt(companies));
            }
            paramIndex++;
        }

        // ფილტრაცია პლატფორმის მიხედვით - გამოსწორებული ვერსია
        if (platform) {
            logger.debug(`დამუშავდა პლატფორმა: ${platform}`);
            conditions.push(`(
                (m.homepage ~ '^https?://' AND m.homepage ILIKE $${paramIndex})
                OR
                (m.homepage ~ '^{.*"url"\\s*:\\s*"https?://.*}$' AND 
                 (m.homepage::text IS NOT NULL) AND 
                 (m.homepage::text != '{}') AND
                 ((m.homepage::json->>'url')::text ILIKE $${paramIndex}))
            )`);
            queryParams.push(`%${platform}%`);
            paramIndex++;
        }

        // პირობების დამატება შეკითხვაში
        if (conditions.length > 0) {
            query += ` AND (${conditions.join(' OR ')})`;
        }

        // სორტირება, ლიმიტი და offset
        query += `
            ORDER BY m.id DESC
            LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
        `;

        queryParams.push(limit, offset);

        logger.debug("შეკითხვა:", query);
        logger.debug("შეკითხვის პარამეტრები:", queryParams);

        const result = await client.query(query, queryParams);
        logger.debug(`ნაპოვნია ${result.rows.length} ფილმი`);

        // თუ შედეგები ცარიელია და გამოყენებულია ფილტრები, გავაკეთოთ სატესტო შეკითხვები
        if (result.rows.length === 0 && (companies || platform)) {
            if (companies) {
                try {
                    const testQuery = `
                        SELECT COUNT(*) as count
                        FROM movie_production_companies
                        WHERE company_id = $1
                    `;
                    const testResult = await client.query(testQuery, [parseInt(companies)]);
                    logger.debug(`სატესტო შეკითხვა კომპანიისთვის ${companies}:`, testResult.rows);
                } catch (error) {
                    logger.error('შეცდომა სატესტო შეკითხვის გაშვებისას:', error);
                }
            }

            if (platform) {
                try {
                    // უსაფრთხო შეკითხვა homepage-ების შესამოწმებლად
                    const testQuery = `
                        SELECT COUNT(*) as count
                        FROM public.movies
                        WHERE homepage ILIKE $1
                    `;
                    const testResult = await client.query(testQuery, [`%${platform}%`]);
                    logger.debug(`სატესტო შეკითხვა პლატფორმისთვის ${platform}:`, testResult.rows);
                } catch (error) {
                    logger.error('შეცდომა სატესტო შეკითხვის გაშვებისას:', error);
                }
            }
        }

        return result;
    } catch (error) {
        logger.error('შეცდომა შეკითხვის გაშვებისას:', error);

        // თუ შეცდომაა JSON-ის წაკითხვისას, ვცადოთ უბრალო შეკითხვა
        if (typeof error === 'object' && error !== null && 'toString' in error && (error as Error).toString().includes('invalid input syntax for type json')) {
            logger.debug('ვცდით შეკითხვას JSON-ის გამოყენების გარეშე');

            try {
                // შეკითხვა JSON ფორმატირების გარეშე
                let fallbackQuery = `
                    SELECT DISTINCT ON (m.id)
                        m.id,
                        m.title_geo,
                        m.title_eng,
                        m.imdb_vote,
                        m.backdrop_poster_url,
                        m.backdrop_path_tmdb,
                        m.release_date,
                        m.homepage AS homepage_url
                    FROM public.movies m
                    LEFT JOIN movie_production_companies mpc ON m.id = mpc.movie_id
                    LEFT JOIN production_companies pc ON pc.id = mpc.company_id
                    WHERE (m.backdrop_poster_url IS NOT NULL OR m.backdrop_path_tmdb IS NOT NULL)
                `;

                const fallbackParams: any[] = [];
                let paramIndex = 1;
                const conditions: string[] = [];

                // კომპანიების ფილტრი
                if (companies) {
                    if (companies.includes(',')) {
                        const companyIds = companies.split(',').map(id => parseInt(id.trim()));
                        conditions.push(`pc.id = ANY($${paramIndex}::int[])`);
                        fallbackParams.push(companyIds);
                    } else {
                        conditions.push(`pc.id = $${paramIndex}::int`);
                        fallbackParams.push(parseInt(companies));
                    }
                    paramIndex++;
                }

                // პლატფორმის ფილტრი - მარტივი ვერსია
                if (platform) {
                    conditions.push(`m.homepage ILIKE $${paramIndex}`);
                    fallbackParams.push(`%${platform}%`);
                    paramIndex++;
                }

                if (conditions.length > 0) {
                    fallbackQuery += ` AND (${conditions.join(' OR ')})`;
                }

                fallbackQuery += `
                    ORDER BY m.id DESC
                    LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
                `;

                fallbackParams.push(limit, offset);

                logger.debug("სათადარიგო შეკითხვა:", fallbackQuery);
                logger.debug("სათადარიგო პარამეტრები:", fallbackParams);

                const fallbackResult = await client.query(fallbackQuery, fallbackParams);
                logger.debug(`სათადარიგო შეკითხვით ნაპოვნია ${fallbackResult.rows.length} ფილმი`);

                return fallbackResult;
            } catch (fallbackError) {
                logger.error('შეცდომა სათადარიგო შეკითხვის გაშვებისას:', fallbackError);
                throw fallbackError;
            }
        }

        throw error;
    } finally {
        client.release();
    }
}

// Next.js 15-ის ქეშირების მექანიზმის გამოყენება
const getCachedMovies = unstable_cache(
    async (page: number, limit: number, companies: string | null, platform: string | null) => {
        try {
            const result = await executeMovieQuery(page, limit, companies, platform);
            return result.rows;
        } catch (error) {
            logger.error('შეცდომა მონაცემთა ბაზიდან მიღებისას:', error);
            throw error;
        }
    },
    ['movies-cache'],
    {
        revalidate: 60, // 1 წუთი
        tags: ['movies']
    }
);

// API მარშრუტის დამმუშავებელი
export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '8');
        const companies = searchParams.get('companies');
        const platform = searchParams.get('platform');

        logger.debug("მოთხოვნილია ფილმების API პარამეტრებით:", { page, limit, companies, platform });

        const movies = await getCachedMovies(page, limit, companies, platform);

        // კეშირების ჰედერების დამატება
        return NextResponse.json({
            movies,
            page,
            limit,
            hasMore: movies.length >= limit
        }, {
            headers: {
                'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
            }
        });
    } catch (error) {
        logger.error('შეცდომა სერვერზე:', error);

        // შეცდომის შემთხვევაში ვაბრუნებთ ცარიელ მასივს
        return NextResponse.json({
            movies: [],
            page: 1,
            limit: 8,
            hasMore: false,
            error: 'შიდა სერვერის შეცდომა'
        }, {
            status: 200, // 200 სტატუსი, რომ ფრონტენდს არ ჰქონდეს შეცდომა
            headers: {
                'Cache-Control': 'no-cache',
            }
        });
    }
}

// ქეშის ხელით რევალიდაციის ფუნქცია - POST მეთოდით
export async function POST(request: NextRequest) {
    try {
        // Next.js 15-ის ქეშის ტეგის რევალიდაცია
        revalidateTag('movies');
        return NextResponse.json({
            revalidated: true,
            now: Date.now(),
            message: 'ფილმების ქეში წარმატებით განახლდა'
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