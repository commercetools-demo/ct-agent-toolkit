import {z} from 'zod';
import {searchProductsParameters} from './parameters';
import {ApiRoot} from '@commercetools/platform-sdk';
import {SDKError} from '../errors/sdkError';

export const searchProducts = async (
  apiRoot: ApiRoot,
  context: {projectKey: string},
  params: z.infer<typeof searchProductsParameters>
) => {
  try {
    const response = await apiRoot
      .withProjectKey({projectKey: context.projectKey})
      .products()
      .search()
      .post({
        body: {
          query: params.query,
          ...(params.sort && {sort: params.sort}),
          ...(params.limit !== undefined && {limit: params.limit}),
          ...(params.offset !== undefined && {offset: params.offset}),
          ...(params.markMatchingVariants !== undefined && {
            markMatchingVariants: params.markMatchingVariants,
          }),
          ...(params.productProjectionParameters && {
            productProjectionParameters: params.productProjectionParameters,
          }),
          ...(params.facets && {facets: params.facets}),
        },
      })
      .execute();

    return response.body;
  } catch (error: any) {
    throw new SDKError('Failed to search products', error);
  }
};
