import {
  readStandalonePricePrompt,
  createStandalonePricePrompt,
  updateStandalonePricePrompt,
} from './prompts';

import {
  readStandalonePriceParameters,
  createStandalonePriceParameters,
  updateStandalonePriceParameters,
} from './parameters';
import {Tool} from '../../types/tools';

const tools: Tool[] = [
  {
    method: 'read_standalone_price',
    name: 'Read Standalone Price',
    description: readStandalonePricePrompt,
    parameters: readStandalonePriceParameters,
    actions: {
      'standalone-price': {
        view: true,
      },
    },
  },
  {
    method: 'create_standalone_price',
    name: 'Create Standalone Price',
    description: createStandalonePricePrompt,
    parameters: createStandalonePriceParameters,
    actions: {
      'standalone-price': {
        modify: true,
      },
    },
  },
  {
    method: 'update_standalone_price',
    name: 'Update Standalone Price',
    description: updateStandalonePricePrompt,
    parameters: updateStandalonePriceParameters,
    actions: {
      'standalone-price': {
        modify: true,
      },
    },
  },
];

export default tools;
