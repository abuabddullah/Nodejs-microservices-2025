import { StatusCodes } from 'http-status-codes';
import AppError from '../../../errors/AppError';
import redisClient from '../../../helpers/redis/redis';
import { invalidatePostCache } from '../../../helpers/redis/redisUtils/invalidatePostCache';
import { logger } from '../../../shared/logger';
import QueryBuilder from '../../builder/QueryBuilder';
import { Ipost } from './post.interface';
import { Post } from './post.model';
import { TUser } from '../../../grpc-clients/identityClient';

const createPost = async (payload: Partial<Ipost>, user: TUser): Promise<Ipost> => {
     logger.info('Create post endpoint hit');
     const postDTO = {
          ...payload,
          user: user._id,
     };
     const newCreatedPost = await Post.create(postDTO);
     if (!newCreatedPost) {
          throw new AppError(StatusCodes.NOT_FOUND, 'Post not found.');
     }

     await invalidatePostCache(newCreatedPost._id.toString());
     // /*
     // // publishEvent for rabbitmq later
     // // **********************
     // // ***********
     // // ****************
     // */
     logger.info('Post created successfully', newCreatedPost);
     return newCreatedPost;
};

const getAllPosts = async (query: Record<string, any>): Promise<{ meta: { total: number; page: number; limit: number }; result: Ipost[] }> => {
     const keys = Object.keys(query);
     const cacheKey = `posts:${query.page || 1}:${query.limit || 10}`;
     // check: must contain exactly 2 keys: page + limit
     if (keys.length === 2 && keys.includes('page') && keys.includes('limit')) {
          const cachedPostsWithMeta = await redisClient.get(cacheKey);

          if (cachedPostsWithMeta) {
               return JSON.parse(cachedPostsWithMeta);
          }
     }
     const queryBuilder = new QueryBuilder(Post.find(), query);
     const result = await queryBuilder.filter().sort().paginate().fields().modelQuery;
     const meta = await queryBuilder.countTotal();

     //save your posts in redis cache
     // check: must contain exactly 2 keys: page + limit
     if (keys.length === 2 && keys.includes('page') && keys.includes('limit')) {
          await redisClient.setex(cacheKey, 300, JSON.stringify({ meta, result }));
     }
     return { meta, result };
};

const getAllUnpaginatedPosts = async (): Promise<Ipost[]> => {
     const cacheKey = `posts:getAllUnpaginatedPosts`;
     const cachedPosts = await redisClient.get(cacheKey);

     if (cachedPosts) {
          return JSON.parse(cachedPosts);
     }
     const result = await Post.find();
     //save your posts in redis cache for 5 minutes
     await redisClient.setex(cacheKey, 300, JSON.stringify(result));
     return result;
};

const updatePost = async (id: string, payload: Partial<Ipost>): Promise<Ipost | null> => {
     const isExist = await Post.findById(id);
     if (!isExist) {
          throw new AppError(StatusCodes.NOT_FOUND, 'Post not found.');
     }

     const result = await Post.findByIdAndUpdate(id, payload, { new: true });
     await invalidatePostCache(id);
     return result;
};

const deletePost = async (id: string): Promise<Ipost | null> => {
     const result = await Post.findById(id);
     if (!result) {
          throw new AppError(StatusCodes.NOT_FOUND, 'Post not found.');
     }
     result.isDeleted = true;
     result.deletedAt = new Date();
     await result.save();

     await invalidatePostCache(id);
     return result;
};

const hardDeletePost = async (id: string): Promise<Ipost | null> => {
     const result = await Post.findByIdAndDelete(id);
     if (!result) {
          throw new AppError(StatusCodes.NOT_FOUND, 'Post not found.');
     }
     // /*
     // // publish post delete method -> for rabbitmq later
     // // **********************
     // // ***********
     // // ****************
     // */

     await invalidatePostCache(id);
     return result;
};

const getPostById = async (postId: string): Promise<Ipost | null> => {
     const cachekey = `post:${postId}`;
     const cachedPost = await redisClient.get(cachekey);

     if (cachedPost) {
          return JSON.parse(cachedPost);
     }
     const result = await Post.findById(postId);
     if (result) {
          // // save your post in redis cache for 1hr
          // await redisClient.setex(cachekey, 3600, JSON.stringify(result));

          // Save your post in Redis cache forever untile invalidated
          await redisClient.set(cachekey, JSON.stringify(result));
     }

     return result;
};

export const postService = {
     createPost,
     getAllPosts,
     getAllUnpaginatedPosts,
     updatePost,
     deletePost,
     hardDeletePost,
     getPostById,
};
