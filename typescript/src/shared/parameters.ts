import {z} from 'zod';

export const listProductsParameters = z.object({
  limit: z
    .number()
    .int()
    .min(1)
    .max(100)
    .optional()
    .describe(
      'A limit on the number of objects to be returned. Limit can range between 1 and 100, and the default is 10.'
    ),
});
