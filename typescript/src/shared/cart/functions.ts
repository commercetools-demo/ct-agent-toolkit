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
  CartReference,
} from '@commercetools/platform-sdk';
import {SDKError} from '../errors/sdkError';

// Helper function to read cart by ID
const readCartById = async (
  apiRoot: ApiRoot,
  projectKey: string,
  id: string,
  expand?: string[],
  storeKey?: string
) => {
  if (storeKey) {
    // Using in-store endpoint
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
  } else {
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
  }
};

// Helper function to read cart by key
const readCartByKey = async (
  apiRoot: ApiRoot,
  projectKey: string,
  key: string,
  expand?: string[],
  storeKey?: string
) => {
  if (storeKey) {
    // Using in-store endpoint
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
  } else {
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
  }
};

// Helper function to read cart by customer ID
const readCartByCustomerId = async (
  apiRoot: ApiRoot,
  projectKey: string,
  customerId: string,
  limit?: number,
  offset?: number,
  sort?: string[],
  expand?: string[],
  storeKey?: string
) => {
  const queryArgs = {
    where: [`customerId="${customerId}"`],
    limit: limit || 1,
    ...(typeof offset !== 'undefined' && {offset}),
    ...(sort && {sort}),
    ...(expand && {expand}),
  };

  if (storeKey) {
    // Using in-store endpoint
    const carts = await apiRoot
      .withProjectKey({projectKey})
      .inStoreKeyWithStoreKeyValue({storeKey})
      .carts()
      .get({queryArgs})
      .execute();
    return carts.body;
  } else {
    const carts = await apiRoot
      .withProjectKey({projectKey})
      .carts()
      .get({queryArgs})
      .execute();
    return carts.body;
  }
};

// Helper function to query carts
const queryCarts = async (
  apiRoot: ApiRoot,
  projectKey: string,
  where: string[],
  limit?: number,
  offset?: number,
  sort?: string[],
  expand?: string[],
  storeKey?: string
) => {
  const queryArgs = {
    where,
    limit: limit || 10,
    ...(offset && {offset}),
    ...(sort && {sort}),
    ...(expand && {expand}),
  };

  if (storeKey) {
    // Using in-store endpoint
    const carts = await apiRoot
      .withProjectKey({projectKey})
      .inStoreKeyWithStoreKeyValue({storeKey})
      .carts()
      .get({queryArgs})
      .execute();
    return carts.body;
  } else {
    const carts = await apiRoot
      .withProjectKey({projectKey})
      .carts()
      .get({queryArgs})
      .execute();
    return carts.body;
  }
};

export const readCart = async (
  apiRoot: ApiRoot,
  context: {projectKey: string; cartId?: string; customerId?: string},
  params: z.infer<typeof readCartParameters>
) => {
  try {
    // Case 0: If context.cartId is provided, always return that cart
    if (context.cartId) {
      return await readCartById(
        apiRoot,
        context.projectKey,
        context.cartId,
        params.expand,
        params.storeKey
      );
    }

    // Case 1: When context.customerId is present but no cartId
    if (context.customerId && !context.cartId) {
      if (params.where) {
        const whereWithCustomerId = [...params.where];
        whereWithCustomerId.push(`customerId="${context.customerId}"`);

        return await queryCarts(
          apiRoot,
          context.projectKey,
          whereWithCustomerId,
          params.limit,
          params.offset,
          params.sort,
          params.expand,
          params.storeKey
        );
      }

      // Default to querying by customerId if no specific query method was provided
      return await readCartByCustomerId(
        apiRoot,
        context.projectKey,
        context.customerId,
        params.limit,
        params.offset,
        params.sort,
        params.expand,
        params.storeKey
      );
    }

    // Case 2: No context.cartId or context.customerId - proceed with original logic
    // Case 2a: Read cart by ID
    if (params.id) {
      return await readCartById(
        apiRoot,
        context.projectKey,
        params.id,
        params.expand,
        params.storeKey
      );
    }

    // Case 2b: Read cart by key
    if (params.key) {
      return await readCartByKey(
        apiRoot,
        context.projectKey,
        params.key,
        params.expand,
        params.storeKey
      );
    }

    // Case 2c: Read cart by customer ID
    if (params.customerId) {
      return await readCartByCustomerId(
        apiRoot,
        context.projectKey,
        params.customerId,
        params.limit,
        params.offset,
        params.sort,
        params.expand,
        params.storeKey
      );
    }

    // Case 2d: Query carts with provided where conditions
    if (params.where) {
      return await queryCarts(
        apiRoot,
        context.projectKey,
        params.where,
        params.limit,
        params.offset,
        params.sort,
        params.expand,
        params.storeKey
      );
    }

    throw new Error(
      'Invalid parameters: At least one of id, key, customerId, or where must be provided'
    );
  } catch (error: any) {
    throw new SDKError('Failed to read cart', error);
  }
};

export const createCart = async (
  apiRoot: ApiRoot,
  context: {projectKey: string},
  params: z.infer<typeof createCartParameters>
) => {
  try {
    let cart;

    if (params.store?.key) {
      // Using in-store endpoint
      cart = await apiRoot
        .withProjectKey({projectKey: context.projectKey})
        .inStoreKeyWithStoreKeyValue({storeKey: params.store.key})
        .carts()
        .post({
          body: params as CartDraft,
        })
        .execute();
    } else {
      cart = await apiRoot
        .withProjectKey({projectKey: context.projectKey})
        .carts()
        .post({
          body: params as CartDraft,
        })
        .execute();
    }

    return cart.body;
  } catch (error: any) {
    throw new SDKError('Failed to create cart', error);
  }
};

export const replicateCart = async (
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

export const updateCart = async (
  apiRoot: ApiRoot,
  context: {projectKey: string},
  params: z.infer<typeof updateCartParameters>
) => {
  try {
    let cart;

    // Handle the different combinations of id/key and store/no-store
    if (params.id) {
      if (params.storeKey) {
        // Using in-store endpoint with ID
        cart = await apiRoot
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
        cart = await apiRoot
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
        cart = await apiRoot
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
        cart = await apiRoot
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
    } else {
      throw new Error('Either id or key must be provided');
    }

    return cart.body;
  } catch (error: any) {
    throw new SDKError('Failed to update cart', error);
  }
};
