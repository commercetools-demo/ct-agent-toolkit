import {createProductPrompt, listProductsPrompt} from './prompts';

import {createProductParameters, listProductsParameters} from './parameters';
import {Tool} from '../../types/tools';

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
  {
    method: 'create_product',
    name: 'Create Product',
    description: createProductPrompt,
    parameters: createProductParameters,
    actions: {
      products: {
        create: true,
      },
    },
  },
];

export default tools;
