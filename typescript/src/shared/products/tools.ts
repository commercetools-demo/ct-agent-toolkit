import {
  createProductPrompt,
  listProductsPrompt,
  updateProductPrompt,
} from './prompts';

import {
  createProductParameters,
  listProductsParameters,
  updateProductParameters,
} from './parameters';
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
  {
    method: 'update_product',
    name: 'Update Product',
    description: updateProductPrompt,
    parameters: updateProductParameters,
    actions: {
      products: {
        update: true,
      },
    },
  },
];

export default tools;
