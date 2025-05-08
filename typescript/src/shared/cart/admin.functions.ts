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

// Helper function to read cart by ID in admin scope
const readCartById = async (
  apiRoot: ApiRoot,
  projectKey: string,
  id: string,
  expand?: string[]
) => {
  const cart = await apiRoot
    .withProjectKey({projectKey})
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

// Helper function to read cart by key in admin scope
const readCartByKey = async (
  apiRoot: ApiRoot,
  projectKey: string,
  key: string,
  expand?: string[]
) => {
  const cart = await apiRoot
    .withProjectKey({projectKey})
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

// Helper function to read cart by customer ID in admin scope
const readCartByCustomerId = async (
  apiRoot: ApiRoot,
  projectKey: string,
  customerId: string,
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
    .carts()
    .get({queryArgs})
    .execute();
  return carts.body;
};

// Helper function to query carts in admin scope
const queryCarts = async (
  apiRoot: ApiRoot,
  projectKey: string,
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
    .carts()
    .get({queryArgs})
    .execute();
  return carts.body;
};

// Read cart for admin scope
export const readAdminCart = async (
  apiRoot: ApiRoot,
  context: {projectKey: string},
  params: z.infer<typeof readCartParameters>
) => {
  try {
    // Case 1: Read cart by ID
    if (params.id) {
      return await readCartById(
        apiRoot,
        context.projectKey,
        params.id,
        params.expand
      );
    }

    // Case 2: Read cart by key
    if (params.key) {
      return await readCartByKey(
        apiRoot,
        context.projectKey,
        params.key,
        params.expand
      );
    }

    // Case 3: Read cart by customer ID
    if (params.customerId) {
      return await readCartByCustomerId(
        apiRoot,
        context.projectKey,
        params.customerId,
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
    throw new SDKError('Failed to read cart', error);
  }
};

// Create cart for admin scope
export const createAdminCart = async (
  apiRoot: ApiRoot,
  context: {projectKey: string},
  params: z.infer<typeof createCartParameters>
) => {
  try {
    const cartDraft = params as CartDraft;

    // Admin can create carts in any store if specified
    if (params.store?.key) {
      const cart = await apiRoot
        .withProjectKey({projectKey: context.projectKey})
        .inStoreKeyWithStoreKeyValue({storeKey: params.store.key})
        .carts()
        .post({
          body: cartDraft,
        })
        .execute();
      return cart.body;
    } else {
      const cart = await apiRoot
        .withProjectKey({projectKey: context.projectKey})
        .carts()
        .post({
          body: cartDraft,
        })
        .execute();
      return cart.body;
    }
  } catch (error: any) {
    throw new SDKError('Failed to create cart', error);
  }
};

// Update cart for admin scope
export const updateAdminCart = async (
  apiRoot: ApiRoot,
  context: {projectKey: string},
  params: z.infer<typeof updateCartParameters>
) => {
  try {
    if (!params.id && !params.key) {
      throw new Error('Either id or key must be provided');
    }

    let updatedCart;

    // Handle the different combinations of id/key and store/no-store
    if (params.id) {
      if (params.storeKey) {
        // Using in-store endpoint with ID
        updatedCart = await apiRoot
          .withProjectKey({projectKey: context.projectKey})
          .inStoreKeyWithStoreKeyValue({storeKey: params.storeKey})
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
        // Using regular endpoint with ID
        updatedCart = await apiRoot
          .withProjectKey({projectKey: context.projectKey})
          .carts()
          .withId({ID: params.id})
          .post({
            body: {
              version: params.version,
              actions: params.actions as CartUpdateAction[],
            },
          })
          .execute();
      }
    } else if (params.key) {
      if (params.storeKey) {
        // Using in-store endpoint with key
        updatedCart = await apiRoot
          .withProjectKey({projectKey: context.projectKey})
          .inStoreKeyWithStoreKeyValue({storeKey: params.storeKey})
          .carts()
          .withKey({key: params.key})
          .post({
            body: {
              version: params.version,
              actions: params.actions as CartUpdateAction[],
            },
          })
          .execute();
      } else {
        // Using regular endpoint with key
        updatedCart = await apiRoot
          .withProjectKey({projectKey: context.projectKey})
          .carts()
          .withKey({key: params.key})
          .post({
            body: {
              version: params.version,
              actions: params.actions as CartUpdateAction[],
            },
          })
          .execute();
      }
    }

    return updatedCart!.body;
  } catch (error: any) {
    throw new SDKError('Failed to update cart', error);
  }
};

// Replicate cart for admin scope
export const replicateAdminCart = async (
  apiRoot: ApiRoot,
  context: {projectKey: string},
  params: z.infer<typeof replicateCartParameters>
) => {
  try {
    let cart;

    if (params.storeKey) {
      // Using in-store endpoint
      cart = await apiRoot
        .withProjectKey({projectKey: context.projectKey})
        .inStoreKeyWithStoreKeyValue({storeKey: params.storeKey})
        .carts()
        .replicate()
        .post({
          body: {
            reference: params.reference,
            ...(params.key && {key: params.key}),
          },
        })
        .execute();
    } else {
      cart = await apiRoot
        .withProjectKey({projectKey: context.projectKey})
        .carts()
        .replicate()
        .post({
          body: {
            reference: params.reference,
            ...(params.key && {key: params.key}),
          },
        })
        .execute();
    }

    return cart.body;
  } catch (error: any) {
    throw new SDKError('Failed to replicate cart', error);
  }
};
