import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";

declare global {
  var cachedPrisma: PrismaClient;
  var cachedPool: Pool;
}

let prisma: PrismaClient;
let pool: Pool;

if (process.env.NODE_ENV === "production") {
  prisma = new PrismaClient();
  pool = new Pool({ connectionString: process.env.POSTGRES_URL_USERS });
} else {
  if (!global.cachedPrisma) {
    global.cachedPrisma = new PrismaClient();
  }
  if (!global.cachedPool) {
    global.cachedPool = new Pool({
      connectionString: process.env.POSTGRES_URL_USERS,
    });
  }
  prisma = global.cachedPrisma;
  pool = global.cachedPool;
}

export const db = prisma;
export const pgPool = pool;
