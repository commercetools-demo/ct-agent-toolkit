import {
  readOrderPrompt,
  createOrderFromCartPrompt,
  createOrderFromQuotePrompt,
  createOrderByImportPrompt,
  updateOrderPrompt,
} from './prompts';

import {
  readOrderParameters,
  createOrderFromCartParameters,
  createOrderFromQuoteParameters,
  createOrderByImportParameters,
  updateOrderParameters,
} from './parameters';
import {Tool} from '../../types/tools';

const tools: Tool[] = [
  {
    method: 'read_order',
    name: 'Read Order',
    description: readOrderPrompt,
    parameters: readOrderParameters,
    actions: {
      order: {
        read: true,
      },
    },
  },
  {
    method: 'create_order_from_cart',
    name: 'Create Order from Cart',
    description: createOrderFromCartPrompt,
    parameters: createOrderFromCartParameters,
    actions: {
      order: {
        create: true,
      },
    },
  },
  {
    method: 'create_order_from_quote',
    name: 'Create Order from Quote',
    description: createOrderFromQuotePrompt,
    parameters: createOrderFromQuoteParameters,
    actions: {
      order: {
        create: true,
      },
    },
  },
  {
    method: 'create_order_by_import',
    name: 'Create Order by Import',
    description: createOrderByImportPrompt,
    parameters: createOrderByImportParameters,
    actions: {
      order: {
        create: true,
      },
    },
  },
  {
    method: 'update_order',
    name: 'Update Order',
    description: updateOrderPrompt,
    parameters: updateOrderParameters,
    actions: {
      order: {
        update: true,
      },
    },
  },
];

export default tools;
