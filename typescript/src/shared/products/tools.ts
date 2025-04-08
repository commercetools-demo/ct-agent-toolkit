import {listProductsPrompt} from './prompts';

import {listProductsParameters} from './parameters';
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
];

export default tools;
