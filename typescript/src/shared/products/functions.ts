import {z} from 'zod';
import {
  listProductsParameters,
  createProductParameters,
  updateProductParameters,
} from './parameters';
import {
  ApiRoot,
  ProductDraft,
  ProductUpdateAction,
} from '@commercetools/platform-sdk';

export const listProducts = async (
  apiRoot: ApiRoot,
  context: {projectKey: string},
  params: z.infer<typeof listProductsParameters>
) => {
  try {
    const products = await apiRoot
      .withProjectKey({projectKey: context.projectKey})
      .products()
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

    return products.body;
  } catch (error: any) {
    return 'Failed to list products' + error.message;
  }
};

export const createProduct = async (
  apiRoot: ApiRoot,
  context: {projectKey: string},
  params: z.infer<typeof createProductParameters>
) => {
  try {
    const product = await apiRoot
      .withProjectKey({projectKey: context.projectKey})
      .products()
      .post({
        body: params as ProductDraft,
      })
      .execute();

    return product.body;
  } catch (error: any) {
    throw new Error('Failed to create product: ' + error.message);
  }
};

export const updateProduct = async (
  apiRoot: ApiRoot,
  context: {projectKey: string},
  params: z.infer<typeof updateProductParameters>
) => {
  try {
    const product = await apiRoot
      .withProjectKey({projectKey: context.projectKey})
      .products()
      .withId({ID: params.id})
      .post({
        body: {
          version: params.version,
          actions: params.actions as ProductUpdateAction[],
        },
      })
      .execute();

    return product.body;
  } catch (error: any) {
    throw new Error('Failed to update product: ' + error.message);
  }
};
