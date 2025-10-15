import z from 'zod';

const registerSchema = z.object({
  name: z.string().min(1, 'Name field required'),
  password: z.string().min(1, 'Password field requireds'),
});

export type RegisterSchemaType = z.infer<typeof registerSchema>;
