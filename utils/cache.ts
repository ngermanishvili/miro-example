// utils/cache.ts

// მარტივი მეხსიერების კეში, თუ Redis არ გსურთ
const memoryCache: Record<string, { value: any; expiry: number }> = {};

// Redis კავშირი (თუ გაქვთ)
// const redis = new Redis({
//   url: process.env.UPSTASH_REDIS_REST_URL || '',
//   token: process.env.UPSTASH_REDIS_REST_TOKEN || '',
// });

export const cache = {
    // მონაცემების ამოღება კეშიდან
    async get(key: string): Promise<string | null> {
        // Redis ვარიანტი
        // try {
        //   return await redis.get(key);
        // } catch (error) {
        //   console.error('Redis get error:', error);
        //   return null;
        // }

        // მეხსიერების კეშის ვარიანტი
        const item = memoryCache[key];
        if (!item) return null;

        if (Date.now() > item.expiry) {
            delete memoryCache[key];
            return null;
        }

        return item.value;
    },

    // მონაცემების შენახვა კეშში
    async set(key: string, value: string, options?: { ttl: number }): Promise<void> {
        // Redis ვარიანტი
        // try {
        //   await redis.set(key, value, options ? { ex: options.ttl } : {});
        // } catch (error) {
        //   console.error('Redis set error:', error);
        // }

        // მეხსიერების კეშის ვარიანტი
        const ttl = options?.ttl || 3600; // ნაგულისხმევია 1 საათი
        memoryCache[key] = {
            value,
            expiry: Date.now() + ttl * 1000,
        };
    },

    // კეშის გასუფთავება
    async invalidate(key: string): Promise<void> {
        // Redis ვარიანტი
        // try {
        //   await redis.del(key);
        // } catch (error) {
        //   console.error('Redis invalidate error:', error);
        // }

        // მეხსიერების კეშის ვარიანტი
        delete memoryCache[key];
    },
};