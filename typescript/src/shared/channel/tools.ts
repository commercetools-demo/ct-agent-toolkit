import {
  readChannelPrompt,
  createChannelPrompt,
  updateChannelPrompt,
} from './prompts';

import {
  readChannelParameters,
  createChannelParameters,
  updateChannelParameters,
} from './parameters';
import {Tool} from '../../types/tools';

const tools: Tool[] = [
  {
    method: 'read_channel',
    name: 'Read Channel',
    description: readChannelPrompt,
    parameters: readChannelParameters,
    actions: {
      channel: {
        read: true,
      },
    },
  },
  {
    method: 'create_channel',
    name: 'Create Channel',
    description: createChannelPrompt,
    parameters: createChannelParameters,
    actions: {
      channel: {
        create: true,
      },
    },
  },
  {
    method: 'update_channel',
    name: 'Update Channel',
    description: updateChannelPrompt,
    parameters: updateChannelParameters,
    actions: {
      channel: {
        update: true,
      },
    },
  },
];

export default tools;
