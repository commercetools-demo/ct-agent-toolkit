import {z} from 'zod';
import {
  CREATE_BULK_DESCRIPTION,
  CREATE_BULK_PROMPT,
  UPDATE_BULK_DESCRIPTION,
  UPDATE_BULK_PROMPT,
} from './prompts';
import {bulkCreateParameters, bulkUpdateParameters} from './parameters';
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
  {
    method: 'bulk_update',
    name: 'Bulk Update',
    description: UPDATE_BULK_DESCRIPTION,
    parameters: bulkUpdateParameters,
    actions: {
      bulk: {
        update: true,
      },
    },
  },
];

export default tools;
