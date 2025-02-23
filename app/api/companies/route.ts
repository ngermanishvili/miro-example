// app/api/companies/route.ts
import { NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
    connectionString: process.env.POSTGRES_URL,
    ssl: {
        rejectUnauthorized: false,
    },
});

export async function GET() {
    try {
        const client = await pool.connect();
        const query = `SELECT id, name FROM production_companies`; // Assuming you have an 'id' and 'name' column in your companies table
        const result = await client.query(query);
        client.release();

        return NextResponse.json({ companies: result.rows });
    } catch (error) {
        console.error('Error fetching companies:', error);
        return NextResponse.json({ error: 'Failed to fetch companies' }, { status: 500 });
    }
}

