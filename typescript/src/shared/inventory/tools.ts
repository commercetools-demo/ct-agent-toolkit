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

const inventoryTools = [
  {
    name: 'inventory.read',
    method: 'read_inventory',
    description: 'Read inventory entries by ID, key, or list with filtering',
    parameters: readInventoryParameters,
    prompt: readInventoryPrompt,
  },
  {
    name: 'inventory.create',
    method: 'create_inventory',
    description: 'Create a new inventory entry',
    parameters: createInventoryParameters,
    prompt: createInventoryPrompt,
  },
  {
    name: 'inventory.update',
    method: 'update_inventory',
    description: 'Update or delete an inventory entry by ID or key',
    parameters: updateInventoryParameters,
    prompt: updateInventoryPrompt,
  },
];

export default inventoryTools;
