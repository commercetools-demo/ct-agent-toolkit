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

// Helper function to read cart by customer ID for customer scope
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

// Helper function to read cart by ID for customer scope
const readCartById = async (
  apiRoot: ApiRoot,
  projectKey: string,
  id: string,
  customerId: string,
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

    // Verify the cart belongs to the customer
    if (cart.body.customerId !== customerId) {
      throw new Error('Unauthorized: Cart does not belong to the customer');
    }

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

    // Verify the cart belongs to the customer
    if (cart.body.customerId !== customerId) {
      throw new Error('Unauthorized: Cart does not belong to the customer');
    }

    return cart.body;
  }
};

// Read cart for customer scope
export const readCustomerCart = async (
  apiRoot: ApiRoot,
  context: {projectKey: string; cartId?: string; customerId: string},
  params: z.infer<typeof readCartParameters>
) => {
  try {
    // Case 0: If context.cartId is provided, verify it belongs to the customer
    if (context.cartId) {
      return await readCartById(
        apiRoot,
        context.projectKey,
        context.cartId,
        context.customerId,
        params.expand,
        params.storeKey
      );
    }

    // Case 1: Use customer ID from context
    if (params.where) {
      const whereWithCustomerId = [...params.where];
      whereWithCustomerId.push(`customerId="${context.customerId}"`);

      const queryArgs = {
        where: whereWithCustomerId,
        limit: params.limit || 10,
        ...(params.offset && {offset: params.offset}),
        ...(params.sort && {sort: params.sort}),
        ...(params.expand && {expand: params.expand}),
      };

      if (params.storeKey) {
        // Using in-store endpoint
        const carts = await apiRoot
          .withProjectKey({projectKey: context.projectKey})
          .inStoreKeyWithStoreKeyValue({storeKey: params.storeKey})
          .carts()
          .get({queryArgs})
          .execute();
        return carts.body;
      } else {
        const carts = await apiRoot
          .withProjectKey({projectKey: context.projectKey})
          .carts()
          .get({queryArgs})
          .execute();
        return carts.body;
      }
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
  } catch (error: any) {
    throw new SDKError('Failed to read customer cart', error);
  }
};

// Create cart for customer scope
export const createCustomerCart = async (
  apiRoot: ApiRoot,
  context: {projectKey: string; customerId: string},
  params: z.infer<typeof createCartParameters>
) => {
  try {
    // Automatically set the customerId from context
    const cartDraft = {
      ...params,
      customerId: context.customerId,
    } as CartDraft;

    let cart;
    if (params.store?.key) {
      // Using in-store endpoint
      cart = await apiRoot
        .withProjectKey({projectKey: context.projectKey})
        .inStoreKeyWithStoreKeyValue({storeKey: params.store.key})
        .carts()
        .post({
          body: cartDraft,
        })
        .execute();
    } else {
      cart = await apiRoot
        .withProjectKey({projectKey: context.projectKey})
        .carts()
        .post({
          body: cartDraft,
        })
        .execute();
    }

    return cart.body;
  } catch (error: any) {
    throw new SDKError('Failed to create customer cart', error);
  }
};

// Update cart for customer scope
export const updateCustomerCart = async (
  apiRoot: ApiRoot,
  context: {projectKey: string; customerId: string},
  params: z.infer<typeof updateCartParameters>
) => {
  try {
    let cartToUpdate;

    // First, fetch the cart to verify ownership
    if (params.id) {
      const cart = await apiRoot
        .withProjectKey({projectKey: context.projectKey})
        .carts()
        .withId({ID: params.id})
        .get()
        .execute();

      if (cart.body.customerId !== context.customerId) {
        throw new Error('Unauthorized: Cart does not belong to the customer');
      }

      cartToUpdate = cart.body;
    } else if (params.key) {
      const cart = await apiRoot
        .withProjectKey({projectKey: context.projectKey})
        .carts()
        .withKey({key: params.key})
        .get()
        .execute();

      if (cart.body.customerId !== context.customerId) {
        throw new Error('Unauthorized: Cart does not belong to the customer');
      }

      cartToUpdate = cart.body;
    } else {
      throw new Error('Either id or key must be provided');
    }

    // Now update the cart
    let updatedCart;

    updatedCart = await apiRoot
      .withProjectKey({projectKey: context.projectKey})
      .carts()
      .withId({ID: cartToUpdate.id})
      .post({
        body: {
          version: cartToUpdate.version,
          actions: params.actions as CartUpdateAction[],
        },
      })
      .execute();

    return updatedCart!.body;
  } catch (error: any) {
    throw new SDKError('Failed to update customer cart', error);
  }
};

// Replicate cart for customer scope
export const replicateCustomerCart = async (
  apiRoot: ApiRoot,
  context: {projectKey: string; customerId: string},
  params: z.infer<typeof replicateCartParameters>
) => {
  try {
    // First verify the source cart belongs to the customer
    const sourceCart = await apiRoot
      .withProjectKey({projectKey: context.projectKey})
      .carts()
      .withId({ID: params.reference.id})
      .get()
      .execute();

    if (sourceCart.body.customerId !== context.customerId) {
      throw new Error(
        'Unauthorized: Source cart does not belong to the customer'
      );
    }

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
    throw new SDKError('Failed to replicate customer cart', error);
  }
};
