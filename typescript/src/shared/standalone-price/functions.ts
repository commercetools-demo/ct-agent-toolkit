import {z} from 'zod';
import {
  readStandalonePriceParameters,
  createStandalonePriceParameters,
  updateStandalonePriceParameters,
} from './parameters';
import {
  ApiRoot,
  StandalonePriceDraft,
  StandalonePriceUpdateAction,
} from '@commercetools/platform-sdk';

export const readStandalonePrice = async (
  apiRoot: ApiRoot,
  context: {projectKey: string},
  params: z.infer<typeof readStandalonePriceParameters>
) => {
  try {
    // If ID is provided, fetch a specific standalone price by ID
    if (params.id) {
      const response = await apiRoot
        .withProjectKey({projectKey: context.projectKey})
        .standalonePrices()
        .withId({ID: params.id})
        .get({
          queryArgs: {
            ...(params.expand && {expand: params.expand}),
          },
        })
        .execute();

      return response.body;
    }

    // If key is provided, fetch a specific standalone price by key
    if (params.key) {
      const response = await apiRoot
        .withProjectKey({projectKey: context.projectKey})
        .standalonePrices()
        .withKey({key: params.key})
        .get({
          queryArgs: {
            ...(params.expand && {expand: params.expand}),
          },
        })
        .execute();

      return response.body;
    }

    // Otherwise, query standalone prices with filters
    const response = await apiRoot
      .withProjectKey({projectKey: context.projectKey})
      .standalonePrices()
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

    return response.body;
  } catch (error: any) {
    throw new Error('Failed to read standalone prices: ' + error.message);
  }
};

export const createStandalonePrice = async (
  apiRoot: ApiRoot,
  context: {projectKey: string},
  params: z.infer<typeof createStandalonePriceParameters>
) => {
  try {
    const response = await apiRoot
      .withProjectKey({projectKey: context.projectKey})
      .standalonePrices()
      .post({
        body: params as StandalonePriceDraft,
      })
      .execute();

    return response.body;
  } catch (error: any) {
    throw new Error('Failed to create standalone price: ' + error.message);
  }
};

export const updateStandalonePrice = async (
  apiRoot: ApiRoot,
  context: {projectKey: string},
  params: z.infer<typeof updateStandalonePriceParameters>
) => {
  try {
    // Ensure one of id or key is provided
    if (!params.id && !params.key) {
      throw new Error(
        'Either id or key must be provided for updating a standalone price'
      );
    }

    let response;
    if (params.id) {
      // Update by ID
      response = await apiRoot
        .withProjectKey({projectKey: context.projectKey})
        .standalonePrices()
        .withId({ID: params.id})
        .post({
          body: {
            version: params.version,
            actions: params.actions as StandalonePriceUpdateAction[],
          },
        })
        .execute();
    } else {
      // Update by key
      response = await apiRoot
        .withProjectKey({projectKey: context.projectKey})
        .standalonePrices()
        .withKey({key: params.key!})
        .post({
          body: {
            version: params.version,
            actions: params.actions as StandalonePriceUpdateAction[],
          },
        })
        .execute();
    }

    return response.body;
  } catch (error: any) {
    throw new Error('Failed to update standalone price: ' + error.message);
  }
};
