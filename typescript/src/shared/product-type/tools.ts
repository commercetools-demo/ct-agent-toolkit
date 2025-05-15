import {
  readProductTypePrompt,
  createProductTypePrompt,
  updateProductTypePrompt,
} from './prompts';

import {
  readProductTypeParameters,
  createProductTypeParameters,
  updateProductTypeParameters,
} from './parameters';
import {Tool} from '../../types/tools';

const tools: Tool[] = [
  {
    method: 'read_product_type',
    name: 'Read Product Type',
    description: readProductTypePrompt,
    parameters: readProductTypeParameters,
    actions: {
      'product-type': {
        read: true,
      },
    },
  },
  {
    method: 'create_product_type',
    name: 'Create Product Type',
    description: createProductTypePrompt,
    parameters: createProductTypeParameters,
    actions: {
      'product-type': {
        create: true,
      },
    },
  },
  {
    method: 'update_product_type',
    name: 'Update Product Type',
    description: updateProductTypePrompt,
    parameters: updateProductTypeParameters,
    actions: {
      'product-type': {
        update: true,
      },
    },
  },
];

export default tools;
