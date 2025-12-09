import { z } from 'zod';

const createMediaZodSchema = z.object({
     body: z.object({
          image: z.string({ required_error: 'Image is required' }),
          title: z.string({ required_error: 'title text is required' }),
          description: z.string({ required_error: 'description text is required' }),
     }),
});

const updateMediaZodSchema = z.object({
     body: z.object({
          image: z.string().optional(),
          title: z.string().optional(),
          description: z.string().optional(),
     }),
});

export const mediaValidation = {
     createMediaZodSchema,
     updateMediaZodSchema
};
