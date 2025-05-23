import {readOrderPrompt, createOrderPrompt, updateOrderPrompt} from './prompts';

import {
  readOrderParameters,
  createOrderParameters,
  updateOrderParameters,
} from './parameters';
import {Tool} from '../../types/tools';
import {z} from 'zod';

const tools: Tool[] = [
  {
    method: 'read_order',
    name: 'Read Order',
    description: readOrderPrompt,
    parameters: readOrderParameters,
    actions: {
      order: {
        read: true,
      },
    },
  },
  {
    method: 'create_order',
    name: 'Create Order',
    description: createOrderPrompt,
    parameters: createOrderParameters as unknown as z.ZodObject<
      any,
      any,
      any,
      any
    >,
    actions: {
      order: {
        create: true,
      },
    },
  },
  {
    method: 'update_order',
    name: 'Update Order',
    description: updateOrderPrompt,
    parameters: updateOrderParameters,
    actions: {
      order: {
        update: true,
      },
    },
  },
];

export default tools;
