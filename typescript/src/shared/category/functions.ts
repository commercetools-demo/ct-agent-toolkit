import {z} from 'zod';
import {
  readCategoryParameters,
  createCategoryParameters,
  updateCategoryParameters,
} from './parameters';
import {
  ApiRoot,
  CategoryDraft,
  CategoryUpdateAction,
} from '@commercetools/platform-sdk';
import {SDKError} from '../errors/sdkError';

export const readCategory = async (
  apiRoot: ApiRoot,
  context: {projectKey: string},
  params: z.infer<typeof readCategoryParameters>
) => {
  try {
    // If ID is provided, fetch a single category by ID
    if (params.id) {
      const category = await apiRoot
        .withProjectKey({projectKey: context.projectKey})
        .categories()
        .withId({ID: params.id})
        .get({
          queryArgs: {
            ...(params.expand && {expand: params.expand}),
          },
        })
        .execute();

      return category.body;
    }

    // If key is provided, fetch a single category by key
    if (params.key) {
      const category = await apiRoot
        .withProjectKey({projectKey: context.projectKey})
        .categories()
        .withKey({key: params.key})
        .get({
          queryArgs: {
            ...(params.expand && {expand: params.expand}),
          },
        })
        .execute();

      return category.body;
    }

    // If neither ID nor key is provided, fetch categories list with query parameters
    const categories = await apiRoot
      .withProjectKey({projectKey: context.projectKey})
      .categories()
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

    return categories.body;
  } catch (error: any) {
    throw new SDKError('Failed to read category', error);
  }
};

export const createCategory = async (
  apiRoot: ApiRoot,
  context: {projectKey: string},
  params: z.infer<typeof createCategoryParameters>
) => {
  try {
    const category = await apiRoot
      .withProjectKey({projectKey: context.projectKey})
      .categories()
      .post({
        body: params as CategoryDraft,
      })
      .execute();

    return category.body;
  } catch (error: any) {
    throw new SDKError('Failed to create category', error);
  }
};

export const updateCategory = async (
  apiRoot: ApiRoot,
  context: {projectKey: string},
  params: z.infer<typeof updateCategoryParameters>
) => {
  try {
    if (params.id) {
      const category = await apiRoot
        .withProjectKey({projectKey: context.projectKey})
        .categories()
        .withId({ID: params.id})
        .post({
          body: {
            version: params.version,
            actions: params.actions as CategoryUpdateAction[],
          },
        })
        .execute();

      return category.body;
    }

    if (params.key) {
      const category = await apiRoot
        .withProjectKey({projectKey: context.projectKey})
        .categories()
        .withKey({key: params.key})
        .post({
          body: {
            version: params.version,
            actions: params.actions as CategoryUpdateAction[],
          },
        })
        .execute();

      return category.body;
    }

    throw new Error(
      'Either id or key must be provided for updating a category'
    );
  } catch (error: any) {
    throw new SDKError('Failed to update category', error);
  }
};
