import {z} from 'zod';
import {CREATE_BULK_DESCRIPTION, CREATE_BULK_PROMPT} from './prompts';
import {bulkCreateParameters} from './parameters';
import {Tool} from '../../types/tools';

const tools: Tool[] = [
  {
    method: 'bulk_create',
    name: 'Bulk Create',
    description: CREATE_BULK_DESCRIPTION,
    parameters: bulkCreateParameters,
    actions: {
      bulk: {
        create: true,
      },
    },
  },
];

export default tools;
