// app/api/auth/[...nextauth]/route.ts
import { GET, POST } from "@/auth";

export { GET, POST };

// Force Node.js runtime for Prisma
export const runtime = "nodejs";

// Disable response caching
export const dynamic = "force-dynamic";
