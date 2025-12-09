import { z } from 'zod';

const createMediaZodSchema = z.object({
     body: z
          .object({
               image: z.array(z.string()).min(1).optional(),
               video: z.array(z.string()).min(1).optional(),
               document: z.array(z.string()).min(1).optional(),
               title: z.string({ required_error: 'title text is required' }),
               description: z.string({ required_error: 'description text is required' }),
          })
          .superRefine((data, ctx) => {
               if (!data.image && !data.video && !data.document) {
                    ctx.addIssue({
                         code: z.ZodIssueCode.custom,
                         message: 'At least one of image, video, or document is required',
                    });
               }
          }),
});

const updateMediaZodSchema = z.object({
     body: z
          .object({
               image: z.array(z.string()).min(1).optional(),
               video: z.array(z.string()).min(1).optional(),
               document: z.array(z.string()).min(1).optional(),
               title: z.string().optional(),
               description: z.string().optional(),
          })
          .superRefine((data, ctx) => {
               if (!data.image && !data.video && !data.document) {
                    ctx.addIssue({
                         code: z.ZodIssueCode.custom,
                         message: 'At least one of image, video, or document is required',
                    });
               }
          }),
});

export const mediaValidation = {
     createMediaZodSchema,
     updateMediaZodSchema,
};
