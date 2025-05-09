import {
  ApiRoot,
  CartDraft,
  CartUpdateAction,
} from '@commercetools/platform-sdk';
import {z} from 'zod';
import {SDKError} from '../errors/sdkError';
import {queryCarts, readCartById} from './base.functions';
import {
  readCartParameters,
  createCartParameters,
  updateCartParameters,
  replicateCartParameters,
} from './parameters';
import {CommercetoolsFuncContext} from '../../types/configuration';

export const readCart = async (
  apiRoot: ApiRoot,
  context: CommercetoolsFuncContext,
  params: z.infer<typeof readCartParameters>
) => {
  try {
    if (!context.customerId) {
      throw new SDKError('Customer ID is required', {
        statusCode: 400,
      });
    }
    // Case 0: If context.cartId is provided, always return that cart
    if (context.cartId) {
      const cart = await readCartById(
        apiRoot,
        context.projectKey,
        context.cartId,
        params.expand
      );
      if (cart.customerId === context.customerId) {
        return cart;
      } else {
        throw new SDKError('Cart not found', {
          statusCode: 404,
        });
      }
    }

    // Case 1: When context.customerId is present but no cartId
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
    const whereWithCustomerId = [`customerId="${context.customerId}"`];
    // Default to querying by customerId if no specific query method was provided
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
  } catch (error: any) {
    throw new SDKError('Failed to read cart', error);
  }
};

export const createCart = async (
  apiRoot: ApiRoot,
  context: CommercetoolsFuncContext,
  params: z.infer<typeof createCartParameters>
) => {
  try {
    if (!context.customerId) {
      throw new SDKError('Customer ID is required', {
        statusCode: 400,
      });
    }

    // Ensure customerId is set to the context's customerId
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
    throw new SDKError('Failed to create cart', error);
  }
};

export const replicateCart = async (
  apiRoot: ApiRoot,
  context: CommercetoolsFuncContext,
  params: z.infer<typeof replicateCartParameters>
) => {
  try {
    if (!context.customerId) {
      throw new SDKError('Customer ID is required', {
        statusCode: 400,
      });
    }

    // Verify that the cart to be replicated belongs to the customer
    const originalCart = await apiRoot
      .withProjectKey({projectKey: context.projectKey})
      .carts()
      .withId({ID: params.reference.id})
      .get()
      .execute();

    if (originalCart.body.customerId !== context.customerId) {
      throw new SDKError('Cannot replicate cart: not owned by customer', {
        statusCode: 403,
      });
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
    throw new SDKError('Failed to replicate cart', error);
  }
};

export const updateCart = async (
  apiRoot: ApiRoot,
  context: CommercetoolsFuncContext,
  params: z.infer<typeof updateCartParameters>
) => {
  try {
    if (!context.customerId) {
      throw new SDKError('Customer ID is required', {
        statusCode: 400,
      });
    }

    const cartId = context.cartId || params.id;
    const cartKey = params.key;

    // Verify the cart belongs to the customer if we have an ID or key
    if (cartId || cartKey) {
      let cart;
      if (cartId) {
        cart = await apiRoot
          .withProjectKey({projectKey: context.projectKey})
          .carts()
          .withId({ID: cartId})
          .get()
          .execute();
      } else if (cartKey) {
        cart = await apiRoot
          .withProjectKey({projectKey: context.projectKey})
          .carts()
          .withKey({key: cartKey})
          .get()
          .execute();
      }

      if (cart && cart.body.customerId !== context.customerId) {
        throw new SDKError('Cannot update cart: not owned by customer', {
          statusCode: 403,
        });
      }
    } else {
      throw new SDKError('Either cart ID or key must be provided', {
        statusCode: 400,
      });
    }

    let updatedCart;

    // Handle the different combinations of id/key and store/no-store
    if (cartId) {
      if (params.storeKey) {
        // Using in-store endpoint with ID
        updatedCart = await apiRoot
          .withProjectKey({projectKey: context.projectKey})
          .inStoreKeyWithStoreKeyValue({storeKey: params.storeKey})
          .carts()
          .withId({ID: cartId})
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
          .withId({ID: cartId})
          .post({
            body: {
              version: params.version,
              actions: params.actions as CartUpdateAction[],
            },
          })
          .execute();
      }
    } else if (cartKey) {
      if (params.storeKey) {
        // Using in-store endpoint with key
        updatedCart = await apiRoot
          .withProjectKey({projectKey: context.projectKey})
          .inStoreKeyWithStoreKeyValue({storeKey: params.storeKey})
          .carts()
          .withKey({key: cartKey})
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
          .withKey({key: cartKey})
          .post({
            body: {
              version: params.version,
              actions: params.actions as CartUpdateAction[],
            },
          })
          .execute();
      }
    }

    if (!updatedCart) {
      throw new SDKError('Failed to update cart', {
        statusCode: 500,
      });
    }

    return updatedCart.body;
  } catch (error: any) {
    throw new SDKError('Failed to update cart', error);
  }
};
