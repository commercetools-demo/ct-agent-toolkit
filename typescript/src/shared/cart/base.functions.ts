import {
  ApiRoot,
  CartDraft,
  CartUpdateAction,
  CartReference,
} from '@commercetools/platform-sdk';

export const readCartById = async (
  apiRoot: ApiRoot,
  projectKey: string,
  id: string,
  expand?: string[]
) => {
  const cart = await apiRoot
    .withProjectKey({projectKey})
    .carts()
    .withId({ID: id})
    .get({
      queryArgs: {
        ...(expand && {expand}),
      },
    })
    .execute();
  return cart.body;
};
export const readCartByKey = async (
  apiRoot: ApiRoot,
  projectKey: string,
  key: string,
  expand?: string[]
) => {
  const cart = await apiRoot
    .withProjectKey({projectKey})
    .carts()
    .withKey({key})
    .get({
      queryArgs: {
        ...(expand && {expand}),
      },
    })
    .execute();
  return cart.body;
};

const queryCart = async (
  apiRoot: ApiRoot,
  projectKey: string,
  queryArgs: any,
  storeKey?: string
) => {
  if (storeKey) {
    const carts = await apiRoot
      .withProjectKey({projectKey})
      .inStoreKeyWithStoreKeyValue({storeKey})
      .carts()
      .get({queryArgs})
      .execute();
    return carts.body;
  }
  const carts = await apiRoot
    .withProjectKey({projectKey})
    .carts()
    .get({queryArgs})
    .execute();
  return carts.body;
};

// Helper function to query carts
export const queryCarts = async (
  apiRoot: ApiRoot,
  projectKey: string,
  where?: string[],
  limit?: number,
  offset?: number,
  sort?: string[],
  expand?: string[],
  storeKey?: string
) => {
  const queryArgs = {
    ...(where && {where}),
    limit: limit || 10,
    ...(offset && {offset}),
    ...(sort && {sort}),
    ...(expand && {expand}),
  };

  if (storeKey) {
    // Using in-store endpoint
    const carts = await queryCart(apiRoot, projectKey, queryArgs, storeKey);
    return carts;
  } else {
    const carts = await queryCart(apiRoot, projectKey, queryArgs);
    return carts;
  }
};
