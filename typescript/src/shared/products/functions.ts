import {z} from 'zod';
import {listProductsParameters} from './parameters';
import {ApiRoot} from '@commercetools/platform-sdk';

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
          // Add other query parameters as needed
          // expand: ['masterData.current.categories[*]'] // Example expansion
        },
      })
      .execute();

    return products.body;
  } catch (error: any) {
    console.error(error);
    return 'Failed to list products' + error.message;
  }
};
