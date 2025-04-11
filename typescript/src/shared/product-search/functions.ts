import {z} from 'zod';
import {searchProductsParameters} from './parameters';
import {ApiRoot} from '@commercetools/platform-sdk';

export const searchProducts = async (
  apiRoot: ApiRoot,
  context: {projectKey: string},
  params: z.infer<typeof searchProductsParameters>
) => {
  try {
    // Create a request to the product search endpoint
    const httpClient = (apiRoot as any)._getHttpClient();
    const url = `/${context.projectKey}/product-search`;

    const response = await httpClient.execute({
      uri: url,
      method: 'POST',
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
    });

    return response.body;
  } catch (error: any) {
    throw new Error('Failed to search products: ' + error.message);
  }
};
