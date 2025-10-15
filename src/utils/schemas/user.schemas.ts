import z from 'zod';

export const registerSchema = z.object({
  username: z.string().min(1, 'Name field required'),
  password: z.string().min(1, 'Password field requireds'),
});

export type RegisterSchemaType = z.infer<typeof registerSchema>;
