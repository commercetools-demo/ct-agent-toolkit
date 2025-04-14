import {
  readCartPrompt,
  createCartPrompt,
  replicateCartPrompt,
  updateCartPrompt,
} from './prompts';

import {
  readCartParameters,
  createCartParameters,
  replicateCartParameters,
  updateCartParameters,
} from './parameters';
import {Tool} from '../../types/tools';
import {z} from 'zod';

const tools: Tool[] = [
  {
    method: 'read_cart',
    name: 'Read Cart',
    description: readCartPrompt,
    parameters: readCartParameters as unknown as z.ZodObject<
      any,
      any,
      any,
      any
    >,
    actions: {
      cart: {
        read: true,
      },
    },
  },
  {
    method: 'create_cart',
    name: 'Create Cart',
    description: createCartPrompt,
    parameters: createCartParameters as unknown as z.ZodObject<
      any,
      any,
      any,
      any
    >,
    actions: {
      cart: {
        create: true,
      },
    },
  },
  {
    method: 'replicate_cart',
    name: 'Replicate Cart',
    description: replicateCartPrompt,
    parameters: replicateCartParameters as unknown as z.ZodObject<
      any,
      any,
      any,
      any
    >,
    actions: {
      cart: {
        create: true,
      },
    },
  },
  {
    method: 'update_cart',
    name: 'Update Cart',
    description: updateCartPrompt,
    parameters: updateCartParameters as unknown as z.ZodObject<
      any,
      any,
      any,
      any
    >,
    actions: {
      cart: {
        update: true,
      },
    },
  },
];

export default tools;
