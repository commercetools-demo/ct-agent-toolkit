import {z} from 'zod';
import {
  getCustomerByIdParameters,
  queryCustomersParameters,
  createCustomerParameters,
  updateCustomerParameters,
} from './parameters';
import {
  ApiRoot,
  CustomerDraft,
  CustomerUpdateAction,
} from '@commercetools/platform-sdk';
import {SDKError} from '../errors/sdkError';
import {
  readCustomerById,
  queryCustomers,
  createCustomer as baseCreateCustomer,
  updateCustomer as baseUpdateCustomer,
} from './base.functions';

// Read customer within a specific store
export const readCustomerInStore = async (
  apiRoot: ApiRoot,
  context: {projectKey: string; storeKey: string},
  params: z.infer<typeof getCustomerByIdParameters>
) => {
  try {
    return await readCustomerById(
      apiRoot,
      context.projectKey,
      params.id,
      params.expand,
      context.storeKey
    );
  } catch (error: any) {
    throw new SDKError('Failed to read customer in store', error);
  }
};

// Query customers within a specific store
export const queryCustomersInStore = async (
  apiRoot: ApiRoot,
  context: {projectKey: string; storeKey: string},
  params: z.infer<typeof queryCustomersParameters>
) => {
  try {
    return await queryCustomers(
      apiRoot,
      context.projectKey,
      params.limit,
      params.offset,
      params.sort,
      params.where,
      params.expand,
      context.storeKey
    );
  } catch (error: any) {
    throw new SDKError('Failed to query customers in store', error);
  }
};

// Create customer in a specific store
export const createCustomerInStore = async (
  apiRoot: ApiRoot,
  context: {projectKey: string; storeKey: string},
  params: z.infer<typeof createCustomerParameters>
) => {
  try {
    return await baseCreateCustomer(
      apiRoot,
      context.projectKey,
      params as CustomerDraft,
      context.storeKey
    );
  } catch (error: any) {
    throw new SDKError('Failed to create customer in store', error);
  }
};

// Update customer in a specific store
export const updateCustomerInStore = async (
  apiRoot: ApiRoot,
  context: {projectKey: string; storeKey: string},
  params: z.infer<typeof updateCustomerParameters>
) => {
  try {
    return await baseUpdateCustomer(
      apiRoot,
      context.projectKey,
      params.id,
      params.version,
      params.actions as CustomerUpdateAction[],
      context.storeKey
    );
  } catch (error: any) {
    throw new SDKError('Failed to update customer in store', error);
  }
};
