// app/api/tv-platforms/route.ts
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

// პოპულარული სერიალების პლატფორმების მიღება
const getPopularTVPlatforms = unstable_cache(
    async () => {
        const client = await pool.connect();

        try {
            // შემოწმება homepage ფორმატის და უსაფრთხო ექსტრაქცია
            const query = `
                SELECT 
                    LOWER(
                        REGEXP_REPLACE(
                            REGEXP_REPLACE(
                                homepage_url, 
                                '^https?://(www\\.)?([^/]+).*$', 
                                '\\2'
                            ),
                            '\\.com$|\\.ge$|\\.net$|\\.org$|\\.io$', 
                            ''
                        )
                    ) AS platform_id,
                    REGEXP_REPLACE(
                        REGEXP_REPLACE(
                            homepage_url, 
                            '^https?://(www\\.)?([^/]+).*$', 
                            '\\2'
                        ),
                        '\\.com$|\\.ge$|\\.net$|\\.org$|\\.io$', 
                        ''
                    ) AS platform_name,
                    COUNT(*) as series_count
                FROM (
                    SELECT 
                        CASE 
                            WHEN homepage ~ '^https?://' THEN homepage
                            WHEN homepage ~ '^{.*"url"\\s*:\\s*"https?://.*}$' THEN 
                                (CASE WHEN homepage::text IS NULL THEN NULL
                                WHEN homepage::text = '{}' THEN NULL
                                ELSE (homepage::json->>'url')::text END)
                            ELSE NULL
                        END AS homepage_url
                    FROM public.tv_series
                    WHERE homepage IS NOT NULL AND homepage != ''
                ) AS filtered_homepages
                WHERE 
                    homepage_url IS NOT NULL
                GROUP BY 
                    platform_id, platform_name
                HAVING 
                    COUNT(*) > 1
                ORDER BY 
                    series_count DESC
                LIMIT 12
            `;

            const result = await client.query(query);
            logger.debug(`ნაპოვნია ${result.rows.length} სერიალების პლატფორმა`);

            // დამატებითი თვისებების დამატება
            const platforms = result.rows.map(row => ({
                ...row,
                display_name: capitalize(row.platform_name),
            }));

            return platforms;
        } catch (error) {
            logger.error('შეცდომა სერიალების პლატფორმების მიღებისას:', error);

            // შეცდომის შემთხვევაში, ვცდილობთ უფრო მარტივი შეკითხვის გაშვებას
            try {
                // სათადარიგო შეკითხვა
                const fallbackQuery = `
                    SELECT 
                        LOWER(SUBSTRING(homepage FROM '^(?:https?://)?(?:www\\.)?([^/]+)')) AS platform_id,
                        SUBSTRING(homepage FROM '^(?:https?://)?(?:www\\.)?([^/]+)') AS platform_name,
                        COUNT(*) as series_count
                    FROM 
                        public.tv_series
                    WHERE 
                        homepage IS NOT NULL 
                        AND homepage != ''
                        AND homepage ~ '^https?://'
                    GROUP BY 
                        platform_id, platform_name
                    HAVING 
                        COUNT(*) > 1
                    ORDER BY 
                        series_count DESC
                    LIMIT 12
                `;

                const fallbackResult = await client.query(fallbackQuery);
                logger.debug(`სათადარიგო შეკითხვით ნაპოვნია ${fallbackResult.rows.length} სერიალების პლატფორმა`);

                const fallbackPlatforms = fallbackResult.rows.map(row => ({
                    ...row,
                    display_name: capitalize(row.platform_name),
                }));

                return fallbackPlatforms;
            } catch (fallbackError) {
                logger.error('შეცდომა სათადარიგო შეკითხვის გაშვებისას:', fallbackError);

                // საბოლოოდ დავბრუნოთ ფიქსირებული მონაცემები
                return [
                    { platform_id: 'netflix', platform_name: 'netflix', display_name: 'Netflix', series_count: 12 },
                    { platform_id: 'amazon', platform_name: 'amazon', display_name: 'Amazon Prime', series_count: 10 },
                    { platform_id: 'hbo', platform_name: 'hbo', display_name: 'HBO Max', series_count: 8 },
                    { platform_id: 'disneyplus', platform_name: 'disneyplus', display_name: 'Disney+', series_count: 7 },
                    { platform_id: 'paramount', platform_name: 'paramount', display_name: 'Paramount+', series_count: 6 },
                    { platform_id: 'appletv', platform_name: 'appletv', display_name: 'Apple TV+', series_count: 5 },
                ];
            }
        } finally {
            client.release();
        }
    },
    ['tv-platforms'],
    {
        revalidate: 3600, // 1 საათი
        tags: ['tv-platforms']
    }
);

// სტრინგის პირველი ასოს დიდად ქცევა
function capitalize(str: string): string {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
}

// API მარშრუტი
export async function GET(request: NextRequest) {
    try {
        const platforms = await getPopularTVPlatforms();

        return NextResponse.json({
            platforms,
            count: platforms.length
        }, {
            headers: {
                'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
            }
        });
    } catch (error) {
        logger.error('შეცდომა API-ში:', error);

        // შეცდომის შემთხვევაში დავაბრუნოთ სტატიკური მონაცემები
        const staticPlatforms = [
            { platform_id: 'netflix', platform_name: 'netflix', display_name: 'Netflix', series_count: 12 },
            { platform_id: 'amazon', platform_name: 'amazon', display_name: 'Amazon Prime', series_count: 10 },
            { platform_id: 'hbo', platform_name: 'hbo', display_name: 'HBO Max', series_count: 8 },
            { platform_id: 'disneyplus', platform_name: 'disneyplus', display_name: 'Disney+', series_count: 7 },
            { platform_id: 'paramount', platform_name: 'paramount', display_name: 'Paramount+', series_count: 6 },
            { platform_id: 'appletv', platform_name: 'appletv', display_name: 'Apple TV+', series_count: 5 },
        ];

        return NextResponse.json({
            platforms: staticPlatforms,
            count: staticPlatforms.length,
            error: 'შიდა სერვერის შეცდომა, გამოყენებულია სტატიკური მონაცემები',
        }, {
            status: 200, // ვაბრუნებთ 200 სტატუსს, რათა ფრონტენდი მაინც მუშაობდეს
            headers: {
                'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
            }
        });
    }
}

// ქეშის რევალიდაცია
export async function POST(request: NextRequest) {
    try {
        const { revalidateTag } = await import('next/cache');
        revalidateTag('tv-platforms');
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