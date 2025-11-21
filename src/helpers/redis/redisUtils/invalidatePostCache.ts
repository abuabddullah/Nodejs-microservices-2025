import redisClient from '../redis';

export async function invalidatePostCache(input: string) {
     const cachedKey = `post:${input}`;
     await redisClient.del(cachedKey);

     const keys = await redisClient.keys('posts:*');
     if (keys.length > 0) {
          await redisClient.del(keys);
     }
}
