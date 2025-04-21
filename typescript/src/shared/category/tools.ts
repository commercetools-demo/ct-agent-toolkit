import {
  readCategoryPrompt,
  createCategoryPrompt,
  updateCategoryPrompt,
} from './prompts';

import {
  readCategoryParameters,
  createCategoryParameters,
  updateCategoryParameters,
} from './parameters';
import {Tool} from '../../types/tools';

const tools: Tool[] = [
  {
    method: 'read_category',
    name: 'Read Category',
    description: readCategoryPrompt,
    parameters: readCategoryParameters,
    actions: {
      category: {
        view: true,
      },
    },
  },
  {
    method: 'create_category',
    name: 'Create Category',
    description: createCategoryPrompt,
    parameters: createCategoryParameters,
    actions: {
      category: {
        modify: true,
      },
    },
  },
  {
    method: 'update_category',
    name: 'Update Category',
    description: updateCategoryPrompt,
    parameters: updateCategoryParameters,
    actions: {
      category: {
        modify: true,
      },
    },
  },
];

export default tools;
