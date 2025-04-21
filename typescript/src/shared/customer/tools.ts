import {
  createCustomerPrompt,
  createCustomerInStorePrompt,
  getCustomerByIdPrompt,
  getCustomerInStoreByIdPrompt,
  queryCustomersPrompt,
  updateCustomerPrompt,
  updateCustomerInStorePrompt,
} from './prompts';

import {
  createCustomerParameters,
  createCustomerInStoreParameters,
  getCustomerByIdParameters,
  getCustomerInStoreByIdParameters,
  queryCustomersParameters,
  updateCustomerParameters,
  updateCustomerInStoreParameters,
} from './parameters';
import {Tool} from '../../types/tools';

const tools: Tool[] = [
  {
    method: 'create_customer',
    name: 'Create Customer',
    description: createCustomerPrompt,
    parameters: createCustomerParameters,
    actions: {
      customer: {
        modify: true,
      },
    },
  },
  {
    method: 'create_customer_in_store',
    name: 'Create Customer In Store',
    description: createCustomerInStorePrompt,
    parameters: createCustomerInStoreParameters,
    actions: {
      customer: {
        modify: true,
      },
    },
  },
  {
    method: 'get_customer_by_id',
    name: 'Get Customer By ID',
    description: getCustomerByIdPrompt,
    parameters: getCustomerByIdParameters,
    actions: {
      customer: {
        view: true,
      },
    },
  },
  {
    method: 'get_customer_in_store_by_id',
    name: 'Get Customer In Store By ID',
    description: getCustomerInStoreByIdPrompt,
    parameters: getCustomerInStoreByIdParameters,
    actions: {
      customer: {
        view: true,
      },
    },
  },
  {
    method: 'query_customers',
    name: 'Query Customers',
    description: queryCustomersPrompt,
    parameters: queryCustomersParameters,
    actions: {
      customer: {
        view: true,
      },
    },
  },
  {
    method: 'update_customer',
    name: 'Update Customer',
    description: updateCustomerPrompt,
    parameters: updateCustomerParameters,
    actions: {
      customer: {
        modify: true,
      },
    },
  },
  {
    method: 'update_customer_in_store',
    name: 'Update Customer In Store',
    description: updateCustomerInStorePrompt,
    parameters: updateCustomerInStoreParameters,
    actions: {
      customer: {
        modify: true,
      },
    },
  },
];

export default tools;
