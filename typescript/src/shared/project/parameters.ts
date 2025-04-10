import {z} from 'zod';

export const readProjectParameters = z.object({
  projectKey: z
    .string()
    .optional()
    .describe(
      'The key of the project to read. If not provided, the current project will be used.'
    ),
});
