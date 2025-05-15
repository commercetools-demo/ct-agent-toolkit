import {readProjectPrompt, updateProjectPrompt} from './prompts';
import {readProjectParameters, updateProjectParameters} from './parameters';
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
  {
    method: 'update_project',
    name: 'Update Project',
    description: updateProjectPrompt,
    parameters: updateProjectParameters,
    actions: {
      project: {
        update: true,
      },
    },
  },
];

export default tools;
