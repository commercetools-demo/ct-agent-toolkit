import {
  readDiscountCodePrompt,
  listDiscountCodesPrompt,
  createDiscountCodePrompt,
  updateDiscountCodePrompt,
} from './prompts';

import {
  readDiscountCodeParameters,
  listDiscountCodesParameters,
  createDiscountCodeParameters,
  updateDiscountCodeParameters,
} from './parameters';
import {Tool} from '../../types/tools';

const tools: Tool[] = [
  {
    method: 'read_discount_code',
    name: 'Read Discount Code',
    description: readDiscountCodePrompt,
    parameters: readDiscountCodeParameters,
    actions: {
      'discount-code': {
        view: true,
      },
    },
  },
  {
    method: 'list_discount_codes',
    name: 'List Discount Codes',
    description: listDiscountCodesPrompt,
    parameters: listDiscountCodesParameters,
    actions: {
      'discount-code': {
        view: true,
      },
    },
  },
  {
    method: 'create_discount_code',
    name: 'Create Discount Code',
    description: createDiscountCodePrompt,
    parameters: createDiscountCodeParameters,
    actions: {
      'discount-code': {
        modify: true,
      },
    },
  },
  {
    method: 'update_discount_code',
    name: 'Update Discount Code',
    description: updateDiscountCodePrompt,
    parameters: updateDiscountCodeParameters,
    actions: {
      'discount-code': {
        modify: true,
      },
    },
  },
];

export default tools;
