import {z} from 'zod';
import {
  createCustomerParameters,
  createCustomerInStoreParameters,
  getCustomerByIdParameters,
  getCustomerInStoreByIdParameters,
  queryCustomersParameters,
  updateCustomerParameters,
} from './parameters';
import {
  ApiRoot,
  CustomerDraft,
  CustomerUpdateAction,
} from '@commercetools/platform-sdk';
import {SDKError} from '../errors/sdkError';

export const createCustomer = async (
  apiRoot: ApiRoot,
  context: {projectKey: string},
  params: z.infer<typeof createCustomerParameters>
) => {
  try {
    const customer = await apiRoot
      .withProjectKey({projectKey: context.projectKey})
      .customers()
      .post({
        body: params as CustomerDraft,
      })
      .execute();

    return customer.body;
  } catch (error: any) {
    throw new SDKError('Failed to create customer', error);
  }
};

export const createCustomerInStore = async (
  apiRoot: ApiRoot,
  context: {projectKey: string},
  params: z.infer<typeof createCustomerInStoreParameters>
) => {
  try {
    const {storeKey, ...customerDraft} = params;
    const customer = await apiRoot
      .withProjectKey({projectKey: context.projectKey})
      .inStoreKeyWithStoreKeyValue({storeKey})
      .customers()
      .post({
        body: customerDraft as CustomerDraft,
      })
      .execute();

    return customer.body;
  } catch (error: any) {
    throw new SDKError('Failed to create customer in store', error);
  }
};

export const getCustomerById = async (
  apiRoot: ApiRoot,
  context: {projectKey: string},
  params: z.infer<typeof getCustomerByIdParameters>
) => {
  try {
    const customer = await apiRoot
      .withProjectKey({projectKey: context.projectKey})
      .customers()
      .withId({ID: params.id})
      .get({
        queryArgs: {
          ...(params.expand && {expand: params.expand}),
        },
      })
      .execute();

    return customer.body;
  } catch (error: any) {
    throw new SDKError('Failed to get customer', error);
  }
};

export const getCustomerInStoreById = async (
  apiRoot: ApiRoot,
  context: {projectKey: string},
  params: z.infer<typeof getCustomerInStoreByIdParameters>
) => {
  try {
    const customer = await apiRoot
      .withProjectKey({projectKey: context.projectKey})
      .inStoreKeyWithStoreKeyValue({storeKey: params.storeKey})
      .customers()
      .withId({ID: params.id})
      .get({
        queryArgs: {
          ...(params.expand && {expand: params.expand}),
        },
      })
      .execute();

    return customer.body;
  } catch (error: any) {
    throw new SDKError('Failed to get customer in store', error);
  }
};

export const queryCustomers = async (
  apiRoot: ApiRoot,
  context: {projectKey: string},
  params: z.infer<typeof queryCustomersParameters>
) => {
  try {
    const customers = await apiRoot
      .withProjectKey({projectKey: context.projectKey})
      .customers()
      .get({
        queryArgs: {
          limit: params.limit || 10,
          ...(params.offset && {offset: params.offset}),
          ...(params.sort && {sort: params.sort}),
          ...(params.where && {where: params.where}),
          ...(params.expand && {expand: params.expand}),
        },
      })
      .execute();

    return customers.body;
  } catch (error: any) {
    throw new SDKError('Failed to query customers', error);
  }
};

export const updateCustomer = async (
  apiRoot: ApiRoot,
  context: {projectKey: string},
  params: z.infer<typeof updateCustomerParameters>
) => {
  try {
    const customer = await apiRoot
      .withProjectKey({projectKey: context.projectKey})
      .customers()
      .withId({ID: params.id})
      .post({
        body: {
          version: params.version,
          actions: params.actions as CustomerUpdateAction[],
        },
      })
      .execute();

    return customer.body;
  } catch (error: any) {
    throw new SDKError('Failed to update customer', error);
  }
};
