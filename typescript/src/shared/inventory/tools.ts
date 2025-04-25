import {
  createInventoryParameters,
  readInventoryParameters,
  updateInventoryParameters,
} from './parameters';
import {
  readInventoryPrompt,
  createInventoryPrompt,
  updateInventoryPrompt,
} from './prompts';
import {Tool} from '../../types/tools';

const inventoryTools: Tool[] = [
  {
    name: 'Read Inventory',
    method: 'read_inventory',
    parameters: readInventoryParameters,
    description: readInventoryPrompt,
    actions: {
      inventory: {
        read: true,
      },
    },
  },
  {
    name: 'Create Inventory',
    method: 'create_inventory',
    parameters: createInventoryParameters,
    description: createInventoryPrompt,
    actions: {
      inventory: {
        create: true,
      },
    },
  },
  {
    name: 'Update Inventory',
    method: 'update_inventory',
    parameters: updateInventoryParameters,
    description: updateInventoryPrompt,
    actions: {
      inventory: {
        update: true,
      },
    },
  },
];

export default inventoryTools;
