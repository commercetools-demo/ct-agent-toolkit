import {z} from 'zod';
import {
  readCartDiscountParameters,
  createCartDiscountParameters,
  updateCartDiscountParameters,
} from './parameters';
import {
  ApiRoot,
  CartDiscountDraft,
  CartDiscountUpdateAction,
} from '@commercetools/platform-sdk';

export const readCartDiscount = async (
  apiRoot: ApiRoot,
  context: {projectKey: string},
  params: z.infer<typeof readCartDiscountParameters>
) => {
  try {
    const projectApiRoot = apiRoot.withProjectKey({
      projectKey: context.projectKey,
    });
    let apiRequest;

    // Determine if this is a store-specific request
    if (params.storeKey) {
      apiRequest = projectApiRoot
        .inStoreKeyWithStoreKeyValue({storeKey: params.storeKey})
        .cartDiscounts();
    } else {
      apiRequest = projectApiRoot.cartDiscounts();
    }

    // If ID is provided, fetch by ID
    if (params.id) {
      const cartDiscount = await apiRequest
        .withId({ID: params.id})
        .get({
          queryArgs: {
            ...(params.expand && {expand: params.expand}),
          },
        })
        .execute();

      return cartDiscount.body;
    }

    // If key is provided, fetch by key
    if (params.key) {
      const cartDiscount = await apiRequest
        .withKey({key: params.key})
        .get({
          queryArgs: {
            ...(params.expand && {expand: params.expand}),
          },
        })
        .execute();

      return cartDiscount.body;
    }

    // Otherwise, fetch a list of cart discounts based on query parameters
    const cartDiscounts = await apiRequest
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

    return cartDiscounts.body;
  } catch (error: any) {
    throw new Error('Failed to read cart discount: ' + error.message);
  }
};

export const createCartDiscount = async (
  apiRoot: ApiRoot,
  context: {projectKey: string},
  params: z.infer<typeof createCartDiscountParameters>
) => {
  try {
    const projectApiRoot = apiRoot.withProjectKey({
      projectKey: context.projectKey,
    });

    // Create a cartDiscountDraft without the storeKey parameter
    const {storeKey, ...cartDiscountDraft} = params;

    let apiRequest;

    // Determine if this is a store-specific request
    if (storeKey) {
      apiRequest = projectApiRoot
        .inStoreKeyWithStoreKeyValue({storeKey: storeKey})
        .cartDiscounts();
    } else {
      apiRequest = projectApiRoot.cartDiscounts();
    }

    const cartDiscount = await apiRequest
      .post({
        body: cartDiscountDraft as CartDiscountDraft,
      })
      .execute();

    return cartDiscount.body;
  } catch (error: any) {
    throw new Error('Failed to create cart discount: ' + error.message);
  }
};

export const updateCartDiscount = async (
  apiRoot: ApiRoot,
  context: {projectKey: string},
  params: z.infer<typeof updateCartDiscountParameters>
) => {
  try {
    const projectApiRoot = apiRoot.withProjectKey({
      projectKey: context.projectKey,
    });

    const {storeKey, ...updateParams} = params;

    let apiRequest;

    // Determine if this is a store-specific request
    if (storeKey) {
      apiRequest = projectApiRoot
        .inStoreKeyWithStoreKeyValue({storeKey: storeKey})
        .cartDiscounts();
    } else {
      apiRequest = projectApiRoot.cartDiscounts();
    }

    if (updateParams.id) {
      const cartDiscount = await apiRequest
        .withId({ID: updateParams.id})
        .post({
          body: {
            version: updateParams.version,
            actions: updateParams.actions as CartDiscountUpdateAction[],
          },
        })
        .execute();

      return cartDiscount.body;
    }

    if (updateParams.key) {
      const cartDiscount = await apiRequest
        .withKey({key: updateParams.key})
        .post({
          body: {
            version: updateParams.version,
            actions: updateParams.actions as CartDiscountUpdateAction[],
          },
        })
        .execute();

      return cartDiscount.body;
    }

    throw new Error(
      'Either id or key must be provided to update a cart discount'
    );
  } catch (error: any) {
    throw new Error('Failed to update cart discount: ' + error.message);
  }
};
