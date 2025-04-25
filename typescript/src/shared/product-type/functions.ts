import {z} from 'zod';
import {
  readProductTypeParameters,
  listProductTypesParameters,
  createProductTypeParameters,
  updateProductTypeParameters,
} from './parameters';
import {
  ApiRoot,
  ProductTypeUpdateAction,
  ProductTypeDraft,
} from '@commercetools/platform-sdk';
import {SDKError} from '../errors/sdkError';

export const readProductType = async (
  apiRoot: ApiRoot,
  context: {projectKey: string},
  params: z.infer<typeof readProductTypeParameters>
) => {
  try {
    const productType = await apiRoot
      .withProjectKey({projectKey: context.projectKey})
      .productTypes()
      .withId({ID: params.id})
      .get({
        queryArgs: {
          ...(params.expand && {expand: params.expand}),
        },
      })
      .execute();

    return productType.body;
  } catch (error: any) {
    throw new SDKError('Failed to read product type', error);
  }
};

export const listProductTypes = async (
  apiRoot: ApiRoot,
  context: {projectKey: string},
  params: z.infer<typeof listProductTypesParameters>
) => {
  try {
    const productTypes = await apiRoot
      .withProjectKey({projectKey: context.projectKey})
      .productTypes()
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

    return productTypes.body;
  } catch (error: any) {
    throw new SDKError('Failed to list product types', error);
  }
};

export const createProductType = async (
  apiRoot: ApiRoot,
  context: {projectKey: string},
  params: z.infer<typeof createProductTypeParameters>
) => {
  try {
    const productType = await apiRoot
      .withProjectKey({projectKey: context.projectKey})
      .productTypes()
      .post({
        body: params as ProductTypeDraft,
      })
      .execute();

    return productType.body;
  } catch (error: any) {
    throw new SDKError('Failed to create product type', error);
  }
};

export const updateProductType = async (
  apiRoot: ApiRoot,
  context: {projectKey: string},
  params: z.infer<typeof updateProductTypeParameters>
) => {
  try {
    const productType = await apiRoot
      .withProjectKey({projectKey: context.projectKey})
      .productTypes()
      .withId({ID: params.id})
      .post({
        body: {
          version: params.version,
          actions: params.actions as ProductTypeUpdateAction[],
        },
      })
      .execute();

    return productType.body;
  } catch (error: any) {
    throw new SDKError('Failed to update product type', error);
  }
};
