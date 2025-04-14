import {
  readProductSelectionPrompt,
  createProductSelectionPrompt,
  updateProductSelectionPrompt,
} from './prompts';

import {
  readProductSelectionParameters,
  createProductSelectionParameters,
  updateProductSelectionParameters,
} from './parameters';
import {Tool} from '../../types/tools';

const tools: Tool[] = [
  {
    method: 'read_product_selection',
    name: 'Read Product Selection',
    description: readProductSelectionPrompt,
    parameters: readProductSelectionParameters,
    actions: {
      'product-selection': {
        read: true,
      },
    },
  },
  {
    method: 'create_product_selection',
    name: 'Create Product Selection',
    description: createProductSelectionPrompt,
    parameters: createProductSelectionParameters,
    actions: {
      'product-selection': {
        create: true,
      },
    },
  },
  {
    method: 'update_product_selection',
    name: 'Update Product Selection',
    description: updateProductSelectionPrompt,
    parameters: updateProductSelectionParameters,
    actions: {
      'product-selection': {
        update: true,
      },
    },
  },
];

export default tools;
