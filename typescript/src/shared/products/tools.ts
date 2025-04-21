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
        view: true,
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
        modify: true,
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
        modify: true,
      },
    },
  },
];

export default tools;
