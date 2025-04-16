import {z} from 'zod';
import {
  readDiscountCodeParameters,
  listDiscountCodesParameters,
  createDiscountCodeParameters,
  updateDiscountCodeParameters,
} from './parameters';
import {
  ApiRoot,
  DiscountCodeDraft,
  DiscountCodeUpdateAction,
} from '@commercetools/platform-sdk';

export const readDiscountCode = async (
  apiRoot: ApiRoot,
  context: {projectKey: string},
  params: z.infer<typeof readDiscountCodeParameters>
) => {
  try {
    if (params.id) {
      const discountCode = await apiRoot
        .withProjectKey({projectKey: context.projectKey})
        .discountCodes()
        .withId({ID: params.id})
        .get({
          queryArgs: {
            ...(params.expand && {expand: params.expand}),
          },
        })
        .execute();

      return discountCode.body;
    } else if (params.key) {
      const discountCode = await apiRoot
        .withProjectKey({projectKey: context.projectKey})
        .discountCodes()
        .withKey({key: params.key})
        .get({
          queryArgs: {
            ...(params.expand && {expand: params.expand}),
          },
        })
        .execute();

      return discountCode.body;
    } else {
      throw new Error('Either id or key must be provided');
    }
  } catch (error: any) {
    throw new Error('Failed to read discount code: ' + error.message);
  }
};

export const listDiscountCodes = async (
  apiRoot: ApiRoot,
  context: {projectKey: string},
  params: z.infer<typeof listDiscountCodesParameters>
) => {
  try {
    const discountCodes = await apiRoot
      .withProjectKey({projectKey: context.projectKey})
      .discountCodes()
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

    return discountCodes.body;
  } catch (error: any) {
    throw new Error('Failed to list discount codes: ' + error.message);
  }
};

export const createDiscountCode = async (
  apiRoot: ApiRoot,
  context: {projectKey: string},
  params: z.infer<typeof createDiscountCodeParameters>
) => {
  try {
    const discountCode = await apiRoot
      .withProjectKey({projectKey: context.projectKey})
      .discountCodes()
      .post({
        body: params as DiscountCodeDraft,
      })
      .execute();

    return discountCode.body;
  } catch (error: any) {
    throw new Error('Failed to create discount code: ' + error.message);
  }
};

export const updateDiscountCode = async (
  apiRoot: ApiRoot,
  context: {projectKey: string},
  params: z.infer<typeof updateDiscountCodeParameters>
) => {
  try {
    if (params.id) {
      const discountCode = await apiRoot
        .withProjectKey({projectKey: context.projectKey})
        .discountCodes()
        .withId({ID: params.id})
        .post({
          body: {
            version: params.version,
            actions: params.actions as DiscountCodeUpdateAction[],
          },
        })
        .execute();

      return discountCode.body;
    } else if (params.key) {
      const discountCode = await apiRoot
        .withProjectKey({projectKey: context.projectKey})
        .discountCodes()
        .withKey({key: params.key})
        .post({
          body: {
            version: params.version,
            actions: params.actions as DiscountCodeUpdateAction[],
          },
        })
        .execute();

      return discountCode.body;
    } else {
      throw new Error('Either id or key must be provided');
    }
  } catch (error: any) {
    throw new Error('Failed to update discount code: ' + error.message);
  }
};
