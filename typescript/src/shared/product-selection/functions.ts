import {z} from 'zod';
import {
  readProductSelectionParameters,
  createProductSelectionParameters,
  updateProductSelectionParameters,
} from './parameters';
import {
  ApiRoot,
  ProductSelectionDraft,
  ProductSelectionUpdateAction,
} from '@commercetools/platform-sdk';

export const readProductSelection = async (
  apiRoot: ApiRoot,
  context: {projectKey: string},
  params: z.infer<typeof readProductSelectionParameters>
) => {
  try {
    if (params.id) {
      const productSelection = await apiRoot
        .withProjectKey({projectKey: context.projectKey})
        .productSelections()
        .withId({ID: params.id})
        .get({
          queryArgs: {
            ...(params.expand && {expand: params.expand}),
          },
        })
        .execute();

      return productSelection.body;
    } else if (params.key) {
      const productSelection = await apiRoot
        .withProjectKey({projectKey: context.projectKey})
        .productSelections()
        .withKey({key: params.key})
        .get({
          queryArgs: {
            ...(params.expand && {expand: params.expand}),
          },
        })
        .execute();

      return productSelection.body;
    } else {
      const productSelections = await apiRoot
        .withProjectKey({projectKey: context.projectKey})
        .productSelections()
        .get({
          queryArgs: {
            limit: params.limit || 10,
            ...(typeof params.offset !== 'undefined' && {
              offset: params.offset,
            }),
            ...(params.sort && {sort: params.sort}),
            ...(params.where && {where: params.where}),
            ...(params.expand && {expand: params.expand}),
          },
        })
        .execute();

      return productSelections.body;
    }
  } catch (error: any) {
    throw new Error('Failed to read ProductSelection: ' + error.message);
  }
};

export const createProductSelection = async (
  apiRoot: ApiRoot,
  context: {projectKey: string},
  params: z.infer<typeof createProductSelectionParameters>
) => {
  try {
    const productSelection = await apiRoot
      .withProjectKey({projectKey: context.projectKey})
      .productSelections()
      .post({
        body: params as ProductSelectionDraft,
      })
      .execute();

    return productSelection.body;
  } catch (error: any) {
    throw new Error('Failed to create ProductSelection: ' + error.message);
  }
};

export const updateProductSelection = async (
  apiRoot: ApiRoot,
  context: {projectKey: string},
  params: z.infer<typeof updateProductSelectionParameters>
) => {
  try {
    if (params.id) {
      const productSelection = await apiRoot
        .withProjectKey({projectKey: context.projectKey})
        .productSelections()
        .withId({ID: params.id})
        .post({
          body: {
            version: params.version,
            actions: params.actions as ProductSelectionUpdateAction[],
          },
        })
        .execute();

      return productSelection.body;
    } else if (params.key) {
      const productSelection = await apiRoot
        .withProjectKey({projectKey: context.projectKey})
        .productSelections()
        .withKey({key: params.key})
        .post({
          body: {
            version: params.version,
            actions: params.actions as ProductSelectionUpdateAction[],
          },
        })
        .execute();

      return productSelection.body;
    } else {
      throw new Error(
        'Either id or key must be provided to update a ProductSelection'
      );
    }
  } catch (error: any) {
    throw new Error('Failed to update ProductSelection: ' + error.message);
  }
};
