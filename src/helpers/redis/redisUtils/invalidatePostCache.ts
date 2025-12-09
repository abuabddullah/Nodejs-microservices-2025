import redisClient from '../redis';

export async function invalidateMediaCache(input: string) {
     const cachedKey = `media:${input}`;
     await redisClient.del(cachedKey);

     const keys = await redisClient.keys('medias:*');
     if (keys.length > 0) {
          await redisClient.del(keys);
     }
}
