import {z} from 'zod';

import {listProductsPrompt} from './prompts';

import {listProductsParameters} from './parameters';

export type Tool = {
  method: string;
  name: string;
  description: string;
  parameters: z.ZodObject<any, any, any, any>;
  actions: {
    [key: string]: {
      [action: string]: boolean;
    };
  };
};

const tools: Tool[] = [
  {
    method: 'list_products',
    name: 'List Products',
    description: listProductsPrompt,
    parameters: listProductsParameters,
    actions: {
      products: {
        read: true,
      },
    },
  },
];

export default tools;
