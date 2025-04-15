import {Tool} from '../../types/tools';
import {z} from 'zod';

import {
  CREATE_CUSTOMER_GROUP_PROMPT,
  READ_CUSTOMER_GROUP_PROMPT,
  UPDATE_CUSTOMER_GROUP_PROMPT,
} from './prompts';

// Define parameter schemas directly here for simplicity
const readCustomerGroupParameters = z.object({
  id: z.string().optional().describe('The ID of the customer group to fetch'),
  key: z.string().optional().describe('The key of the customer group to fetch'),
  where: z
    .array(z.string())
    .optional()
    .describe(
      'Query predicates specified as strings for filtering customer groups. Example: ["name=\\"Webshop user\\""]'
    ),
  sort: z
    .array(z.string())
    .optional()
    .describe(
      'Sort criteria for the results. Example: ["name asc", "createdAt desc"]'
    ),
  limit: z
    .number()
    .min(1)
    .max(500)
    .optional()
    .describe(
      'A limit on the number of objects to be returned. Limit can range between 1 and 500, and the default is 10.'
    ),
  offset: z
    .number()
    .min(0)
    .optional()
    .describe(
      'The number of items to skip before starting to collect the result set.'
    ),
  expand: z
    .array(z.string())
    .optional()
    .describe('An array of field paths to expand. Example: ["custom.type"]'),
});

const createCustomerGroupParameters = z.object({
  groupName: z
    .string()
    .describe('Unique name of the customer group in the project'),
  key: z
    .string()
    .optional()
    .describe(
      'User-defined unique identifier for the Customer Group. Pattern: ^[A-Za-z0-9_-]+$, Min length: 2, Max length: 256'
    ),
  custom: z
    .object({
      type: z.object({
        id: z.string(),
        typeId: z.literal('type'),
      }),
      fields: z.record(z.string(), z.any()),
    })
    .optional()
    .describe('Custom fields for the Customer Group'),
});

const updateCustomerGroupParameters = z
  .object({
    id: z
      .string()
      .optional()
      .describe('The ID of the customer group to update'),
    key: z
      .string()
      .optional()
      .describe('The key of the customer group to update'),
    version: z.number().describe('The current version of the customer group'),
    actions: z.array(
      z
        .object({
          action: z
            .string()
            .describe('The name of the update action to perform'),
        })
        .and(z.record(z.string(), z.any()).optional())
        .describe(
          'Array of update actions to perform on the customer group. Each action should have an "action" field and other fields specific to that action type.'
        )
    ),
  })
  .refine((data) => data.id !== undefined || data.key !== undefined, {
    message: 'Either id or key must be provided',
  });

const tools: Tool[] = [
  {
    method: 'read_customer_group',
    name: 'Read Customer Group',
    description: READ_CUSTOMER_GROUP_PROMPT,
    parameters: readCustomerGroupParameters as unknown as z.ZodObject<
      any,
      any,
      any,
      any
    >,
    actions: {
      'customer-group': {
        read: true,
      },
    },
  },
  {
    method: 'create_customer_group',
    name: 'Create Customer Group',
    description: CREATE_CUSTOMER_GROUP_PROMPT,
    parameters: createCustomerGroupParameters as unknown as z.ZodObject<
      any,
      any,
      any,
      any
    >,
    actions: {
      'customer-group': {
        create: true,
      },
    },
  },
  {
    method: 'update_customer_group',
    name: 'Update Customer Group',
    description: UPDATE_CUSTOMER_GROUP_PROMPT,
    parameters: updateCustomerGroupParameters as unknown as z.ZodObject<
      any,
      any,
      any,
      any
    >,
    actions: {
      'customer-group': {
        update: true,
      },
    },
  },
];

export default tools;
