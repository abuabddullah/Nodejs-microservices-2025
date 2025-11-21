import { z } from 'zod';

const createPostZodSchema = z.object({
     body: z.object({
          content: z.string({ required_error: 'content is required' }),
          mediaIds: z.array(z.string()).optional(),
     }),
});

const updatePostZodSchema = z.object({
     body: z.object({
          content: z.string().optional(),
          mediaIds: z.array(z.string()).optional(),
     }),
});

export const postValidation = {
     createPostZodSchema,
     updatePostZodSchema,
};
