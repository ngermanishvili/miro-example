// utils/db.ts
import { Pool } from 'pg';

// ერთი პულის ინსტანსი მთელი აპლიკაციისთვის
let pool: Pool | null = null;

export function getPool(): Pool {
    if (!pool) {
        pool = new Pool({
            connectionString: process.env.DATABASE_URL,
            max: 20, // მეტი კავშირი პულში მაღალი ტრაფიკის შემთხვევაში
            idleTimeoutMillis: 30000, // არააქტიური კავშირების შენარჩუნება 30 წამის განმავლობაში
            connectionTimeoutMillis: 5000, // კავშირის დაყენების ტაიმაუტი 5 წამი
        });

        // კავშირის შემოწმება/დებაგი
        pool.on('connect', () => {
            console.log('Database connection established');
        });

        pool.on('error', (err) => {
            console.error('Unexpected error on idle client', err);
        });
    }

    return pool;
}

// ფუნქცია ერთჯერადი მოთხოვნებისთვის
export async function query(text: string, params: any[]) {
    const client = await getPool().connect();
    try {
        return await client.query(text, params);
    } finally {
        client.release();
    }
}