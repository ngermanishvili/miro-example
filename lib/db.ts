import { Pool, QueryResult } from 'pg';

// პულის შექმნა კონფიგურაციით
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// შეამოწმე კონექცია გაშვებისას
pool.connect((err) => {
    if (err) {
        console.error('Database connection error:', err.stack);
    } else {
        console.log('Connected to PostgreSQL database');
    }
});

// მთავარი query ფუნქცია
export async function query(text: string, params: any[]): Promise<any[]> {
    try {
        const start = Date.now();
        const res: QueryResult = await pool.query(text, params);
        const duration = Date.now() - start;
        console.log('Executed query:', { text, duration, rows: res.rowCount });
        return res.rows;
    } catch (error) {
        console.error('Query error:', error);
        throw error;
    }
}