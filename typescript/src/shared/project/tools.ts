import {readProjectPrompt} from './prompts';
import {readProjectParameters} from './parameters';
import {Tool} from '../../types/tools';

const tools: Tool[] = [
  {
    method: 'read_project',
    name: 'Read Project',
    description: readProjectPrompt,
    parameters: readProjectParameters,
    actions: {
      project: {
        read: true,
      },
    },
  },
];

export default tools; 