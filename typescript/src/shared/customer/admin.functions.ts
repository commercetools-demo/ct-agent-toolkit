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

// Read any customer as admin
export const readCustomer = async (
  apiRoot: ApiRoot,
  context: {projectKey: string},
  params: z.infer<typeof getCustomerByIdParameters>
) => {
  try {
    return await readCustomerById(
      apiRoot,
      context.projectKey,
      params.id,
      params.expand
    );
  } catch (error: any) {
    throw new SDKError('Failed to read customer', error);
  }
};

// Query customers as admin
export const queryCustomersAsAdmin = async (
  apiRoot: ApiRoot,
  context: {projectKey: string},
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
      params.expand
    );
  } catch (error: any) {
    throw new SDKError('Failed to query customers', error);
  }
};

// Create customer as admin
export const createCustomerAsAdmin = async (
  apiRoot: ApiRoot,
  context: {projectKey: string},
  params: z.infer<typeof createCustomerParameters>
) => {
  try {
    return await baseCreateCustomer(
      apiRoot,
      context.projectKey,
      params as CustomerDraft
    );
  } catch (error: any) {
    throw new SDKError('Failed to create customer', error);
  }
};

// Update customer as admin
export const updateCustomerAsAdmin = async (
  apiRoot: ApiRoot,
  context: {projectKey: string},
  params: z.infer<typeof updateCustomerParameters>
) => {
  try {
    return await baseUpdateCustomer(
      apiRoot,
      context.projectKey,
      params.id,
      params.version,
      params.actions as CustomerUpdateAction[]
    );
  } catch (error: any) {
    throw new SDKError('Failed to update customer', error);
  }
};
