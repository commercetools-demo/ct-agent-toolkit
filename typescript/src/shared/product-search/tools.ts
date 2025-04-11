import {searchProductsPrompt} from './prompts';
import {searchProductsParameters} from './parameters';
import {Tool} from '../../types/tools';

const tools: Tool[] = [
  {
    method: 'search_products',
    name: 'Search Products',
    description: searchProductsPrompt,
    parameters: searchProductsParameters,
    actions: {
      'product-search': {
        read: true,
      },
    },
  },
];

export default tools;
