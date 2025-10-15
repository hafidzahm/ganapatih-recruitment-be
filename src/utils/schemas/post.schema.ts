import z from 'zod';

export const postSchema = z.object({
  content: z.string().min(1, 'Content field is required'),
});

export type PostSchemaType = z.infer<typeof postSchema>;
