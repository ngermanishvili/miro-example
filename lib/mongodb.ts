// lib/mongodb.ts
import { MongoClient } from 'mongodb';

if (!process.env.MONGODB_URI) {
    throw new Error('Please add your Mongo URI to .env.local');
}

const uri = process.env.MONGODB_URI || '';
const dbName = process.env.MONGODB_DB || 'draftwork'; // დავამატეთ დათაბეისის სახელი
const options = {};

let client;
let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === 'development') {
    // In development mode, use a global variable so that the value
    // is preserved across module reloads caused by HMR (Hot Module Replacement).
    let globalWithMongo = global as typeof globalThis & {
        _mongoClientPromise?: Promise<MongoClient>;
    };

    if (!globalWithMongo._mongoClientPromise) {
        client = new MongoClient(uri, options);
        globalWithMongo._mongoClientPromise = client.connect();
    }
    clientPromise = globalWithMongo._mongoClientPromise;
} else {
    // In production mode, it's best to not use a global variable.
    client = new MongoClient(uri, options);
    clientPromise = client.connect();
}

// გასწორებული connectToDatabase ფუნქცია
export async function connectToDatabase() {
    const client = await clientPromise;
    const db = client.db(dbName);  // ვუთითებთ კონკრეტულ დათაბეისს
    return { client, db };
}

export default clientPromise;