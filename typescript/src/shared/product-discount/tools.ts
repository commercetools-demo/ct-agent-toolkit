import {
  readProductDiscountPrompt,
  createProductDiscountPrompt,
  updateProductDiscountPrompt,
} from './prompts';

import {
  readProductDiscountParameters,
  createProductDiscountParameters,
  updateProductDiscountParameters,
} from './parameters';
import {Tool} from '../../types/tools';

const tools: Tool[] = [
  {
    method: 'read_product_discount',
    name: 'Read Product Discount',
    description: readProductDiscountPrompt,
    parameters: readProductDiscountParameters,
    actions: {
      'product-discount': {
        read: true,
      },
    },
  },
  {
    method: 'create_product_discount',
    name: 'Create Product Discount',
    description: createProductDiscountPrompt,
    parameters: createProductDiscountParameters,
    actions: {
      'product-discount': {
        create: true,
      },
    },
  },
  {
    method: 'update_product_discount',
    name: 'Update Product Discount',
    description: updateProductDiscountPrompt,
    parameters: updateProductDiscountParameters,
    actions: {
      'product-discount': {
        update: true,
      },
    },
  },
];

export default tools;
