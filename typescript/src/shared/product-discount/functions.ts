import {z} from 'zod';
import {
  readProductDiscountParameters,
  createProductDiscountParameters,
  updateProductDiscountParameters,
} from './parameters';
import {
  ApiRoot,
  ProductDiscountDraft,
  ProductDiscountUpdateAction,
} from '@commercetools/platform-sdk';

export const readProductDiscount = async (
  apiRoot: ApiRoot,
  context: {projectKey: string},
  params: z.infer<typeof readProductDiscountParameters>
) => {
  try {
    // If ID is provided, fetch by ID
    if (params.id) {
      const productDiscount = await apiRoot
        .withProjectKey({projectKey: context.projectKey})
        .productDiscounts()
        .withId({ID: params.id})
        .get({
          queryArgs: {
            ...(params.expand && {expand: params.expand}),
          },
        })
        .execute();

      return productDiscount.body;
    }

    // If key is provided, fetch by key
    if (params.key) {
      const productDiscount = await apiRoot
        .withProjectKey({projectKey: context.projectKey})
        .productDiscounts()
        .withKey({key: params.key})
        .get({
          queryArgs: {
            ...(params.expand && {expand: params.expand}),
          },
        })
        .execute();

      return productDiscount.body;
    }

    // Otherwise, fetch a list of product discounts based on query parameters
    const productDiscounts = await apiRoot
      .withProjectKey({projectKey: context.projectKey})
      .productDiscounts()
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

    return productDiscounts.body;
  } catch (error: any) {
    throw new Error('Failed to read product discount: ' + error.message);
  }
};

export const createProductDiscount = async (
  apiRoot: ApiRoot,
  context: {projectKey: string},
  params: z.infer<typeof createProductDiscountParameters>
) => {
  try {
    const productDiscount = await apiRoot
      .withProjectKey({projectKey: context.projectKey})
      .productDiscounts()
      .post({
        body: params as ProductDiscountDraft,
      })
      .execute();

    return productDiscount.body;
  } catch (error: any) {
    throw new Error('Failed to create product discount: ' + error.message);
  }
};

export const updateProductDiscount = async (
  apiRoot: ApiRoot,
  context: {projectKey: string},
  params: z.infer<typeof updateProductDiscountParameters>
) => {
  try {
    if (params.id) {
      const productDiscount = await apiRoot
        .withProjectKey({projectKey: context.projectKey})
        .productDiscounts()
        .withId({ID: params.id})
        .post({
          body: {
            version: params.version,
            actions: params.actions as ProductDiscountUpdateAction[],
          },
        })
        .execute();

      return productDiscount.body;
    }

    if (params.key) {
      const productDiscount = await apiRoot
        .withProjectKey({projectKey: context.projectKey})
        .productDiscounts()
        .withKey({key: params.key})
        .post({
          body: {
            version: params.version,
            actions: params.actions as ProductDiscountUpdateAction[],
          },
        })
        .execute();

      return productDiscount.body;
    }

    throw new Error(
      'Either id or key must be provided to update a product discount'
    );
  } catch (error: any) {
    throw new Error('Failed to update product discount: ' + error.message);
  }
};
