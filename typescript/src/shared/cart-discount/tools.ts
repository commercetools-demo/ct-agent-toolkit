import {
  readCartDiscountPrompt,
  createCartDiscountPrompt,
  updateCartDiscountPrompt,
} from './prompts';

import {
  readCartDiscountParameters,
  createCartDiscountParameters,
  updateCartDiscountParameters,
} from './parameters';
import {Tool} from '../../types/tools';

const tools: Tool[] = [
  {
    method: 'read_cart_discount',
    name: 'Read Cart Discount',
    description: readCartDiscountPrompt,
    parameters: readCartDiscountParameters,
    actions: {
      'cart-discount': {
        view: true,
      },
    },
  },
  {
    method: 'create_cart_discount',
    name: 'Create Cart Discount',
    description: createCartDiscountPrompt,
    parameters: createCartDiscountParameters,
    actions: {
      'cart-discount': {
        modify: true,
      },
    },
  },
  {
    method: 'update_cart_discount',
    name: 'Update Cart Discount',
    description: updateCartDiscountPrompt,
    parameters: updateCartDiscountParameters,
    actions: {
      'cart-discount': {
        modify: true,
      },
    },
  },
];

export default tools;
