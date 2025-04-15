import {
  createCustomerPrompt,
  createCustomerInStorePrompt,
  getCustomerByIdPrompt,
  getCustomerInStoreByIdPrompt,
  queryCustomersPrompt,
  updateCustomerPrompt,
} from './prompts';

import {
  createCustomerParameters,
  createCustomerInStoreParameters,
  getCustomerByIdParameters,
  getCustomerInStoreByIdParameters,
  queryCustomersParameters,
  updateCustomerParameters,
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
        create: true,
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
        create: true,
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
        read: true,
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
        read: true,
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
        read: true,
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
        update: true,
      },
    },
  },
];

export default tools;
