import {z} from 'zod';
import {
  readCartParameters,
  createCartParameters,
  replicateCartParameters,
  updateCartParameters,
} from './parameters';
import {
  ApiRoot,
  CartDraft,
  CartUpdateAction,
} from '@commercetools/platform-sdk';
import {SDKError} from '../errors/sdkError';

// Helper function to read cart by ID in store scope
const readCartById = async (
  apiRoot: ApiRoot,
  projectKey: string,
  id: string,
  storeKey: string,
  expand?: string[]
) => {
  const cart = await apiRoot
    .withProjectKey({projectKey})
    .inStoreKeyWithStoreKeyValue({storeKey})
    .carts()
    .withId({ID: id})
    .get({
      queryArgs: {
        ...(expand && {expand}),
      },
    })
    .execute();
  return cart.body;
};

// Helper function to read cart by key in store scope
const readCartByKey = async (
  apiRoot: ApiRoot,
  projectKey: string,
  key: string,
  storeKey: string,
  expand?: string[]
) => {
  const cart = await apiRoot
    .withProjectKey({projectKey})
    .inStoreKeyWithStoreKeyValue({storeKey})
    .carts()
    .withKey({key})
    .get({
      queryArgs: {
        ...(expand && {expand}),
      },
    })
    .execute();
  return cart.body;
};

// Helper function to read cart by customer ID in store scope
const readCartByCustomerId = async (
  apiRoot: ApiRoot,
  projectKey: string,
  customerId: string,
  storeKey: string,
  limit?: number,
  offset?: number,
  sort?: string[],
  expand?: string[]
) => {
  const queryArgs = {
    where: [`customerId="${customerId}"`],
    limit: limit || 1,
    ...(typeof offset !== 'undefined' && {offset}),
    ...(sort && {sort}),
    ...(expand && {expand}),
  };

  const carts = await apiRoot
    .withProjectKey({projectKey})
    .inStoreKeyWithStoreKeyValue({storeKey})
    .carts()
    .get({queryArgs})
    .execute();
  return carts.body;
};

// Helper function to query carts in store scope
const queryCarts = async (
  apiRoot: ApiRoot,
  projectKey: string,
  storeKey: string,
  where: string[],
  limit?: number,
  offset?: number,
  sort?: string[],
  expand?: string[]
) => {
  const queryArgs = {
    where,
    limit: limit || 10,
    ...(offset && {offset}),
    ...(sort && {sort}),
    ...(expand && {expand}),
  };

  const carts = await apiRoot
    .withProjectKey({projectKey})
    .inStoreKeyWithStoreKeyValue({storeKey})
    .carts()
    .get({queryArgs})
    .execute();
  return carts.body;
};

// Read cart for store scope
export const readStoreCart = async (
  apiRoot: ApiRoot,
  context: {projectKey: string; cartId?: string; storeKey: string},
  params: z.infer<typeof readCartParameters>
) => {
  try {
    // Case 0: If context.cartId is provided, read that cart from the store
    if (context.cartId) {
      return await readCartById(
        apiRoot,
        context.projectKey,
        context.cartId,
        context.storeKey,
        params.expand
      );
    }

    // Case 1: Read cart by ID
    if (params.id) {
      return await readCartById(
        apiRoot,
        context.projectKey,
        params.id,
        context.storeKey,
        params.expand
      );
    }

    // Case 2: Read cart by key
    if (params.key) {
      return await readCartByKey(
        apiRoot,
        context.projectKey,
        params.key,
        context.storeKey,
        params.expand
      );
    }

    // Case 3: Read cart by customer ID
    if (params.customerId) {
      return await readCartByCustomerId(
        apiRoot,
        context.projectKey,
        params.customerId,
        context.storeKey,
        params.limit,
        params.offset,
        params.sort,
        params.expand
      );
    }

    // Case 4: Query carts with provided where conditions
    if (params.where) {
      return await queryCarts(
        apiRoot,
        context.projectKey,
        context.storeKey,
        params.where,
        params.limit,
        params.offset,
        params.sort,
        params.expand
      );
    }

    throw new Error(
      'Invalid parameters: At least one of id, key, customerId, or where must be provided'
    );
  } catch (error: any) {
    throw new SDKError('Failed to read store cart', error);
  }
};

// Create cart for store scope
export const createStoreCart = async (
  apiRoot: ApiRoot,
  context: {projectKey: string; storeKey: string},
  params: z.infer<typeof createCartParameters>
) => {
  try {
    // Set the store reference automatically from context
    const cartDraft = {
      ...params,
      store: {
        key: context.storeKey,
        typeId: 'store' as const,
      },
    } as CartDraft;

    const cart = await apiRoot
      .withProjectKey({projectKey: context.projectKey})
      .inStoreKeyWithStoreKeyValue({storeKey: context.storeKey})
      .carts()
      .post({
        body: cartDraft,
      })
      .execute();

    return cart.body;
  } catch (error: any) {
    throw new SDKError('Failed to create store cart', error);
  }
};

// Update cart for store scope
export const updateStoreCart = async (
  apiRoot: ApiRoot,
  context: {projectKey: string; storeKey: string},
  params: z.infer<typeof updateCartParameters>
) => {
  try {
    if (!params.id && !params.key) {
      throw new Error('Either id or key must be provided');
    }

    let updatedCart;
    if (params.id) {
      // Using in-store endpoint with ID
      updatedCart = await apiRoot
        .withProjectKey({projectKey: context.projectKey})
        .inStoreKeyWithStoreKeyValue({storeKey: context.storeKey})
        .carts()
        .withId({ID: params.id})
        .post({
          body: {
            version: params.version,
            actions: params.actions as CartUpdateAction[],
          },
        })
        .execute();
    } else {
      // Using in-store endpoint with key
      updatedCart = await apiRoot
        .withProjectKey({projectKey: context.projectKey})
        .inStoreKeyWithStoreKeyValue({storeKey: context.storeKey})
        .carts()
        .withKey({key: params.key!})
        .post({
          body: {
            version: params.version,
            actions: params.actions as CartUpdateAction[],
          },
        })
        .execute();
    }

    return updatedCart.body;
  } catch (error: any) {
    throw new SDKError('Failed to update store cart', error);
  }
};

// Replicate cart for store scope
export const replicateStoreCart = async (
  apiRoot: ApiRoot,
  context: {projectKey: string; storeKey: string},
  params: z.infer<typeof replicateCartParameters>
) => {
  try {
    const cart = await apiRoot
      .withProjectKey({projectKey: context.projectKey})
      .inStoreKeyWithStoreKeyValue({storeKey: context.storeKey})
      .carts()
      .replicate()
      .post({
        body: {
          reference: params.reference,
          ...(params.key && {key: params.key}),
        },
      })
      .execute();

    return cart.body;
  } catch (error: any) {
    throw new SDKError('Failed to replicate store cart', error);
  }
};
