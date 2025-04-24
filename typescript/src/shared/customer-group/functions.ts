import {ApiRoot} from '@commercetools/platform-sdk';
import {
  CreateCustomerGroupParameters,
  CustomerGroupUpdateAction,
  QueryCustomerGroupsParameters,
  ReadCustomerGroupByIdParameters,
  ReadCustomerGroupByKeyParameters,
  UpdateCustomerGroupByIdParameters,
  UpdateCustomerGroupByKeyParameters,
} from './parameters';
import {SDKError} from '../errors/sdkError';

// Export the CustomerGroupUpdateAction type for use in tests
export {CustomerGroupUpdateAction};

export const getCustomerGroup = (apiRoot: any, context: any, params: any) => {
  if (params.id) {
    return getCustomerGroupById(apiRoot, context, {
      id: params.id,
      expand: params.expand,
    });
  } else if (params.key) {
    return getCustomerGroupByKey(apiRoot, context, {
      key: params.key,
      expand: params.expand,
    });
  } else {
    return queryCustomerGroups(apiRoot, context, params);
  }
};

export const updateCustomerGroup = (
  apiRoot: any,
  context: any,
  params: any
) => {
  if (params.id) {
    return updateCustomerGroupById(apiRoot, context, params);
  } else if (params.key) {
    return updateCustomerGroupByKey(apiRoot, context, params);
  } else {
    throw new Error(
      'Either id or key must be provided to update a customer group'
    );
  }
};
/**
 * Fetches a customer group by its ID
 */
export async function getCustomerGroupById(
  apiRoot: ApiRoot,
  context: {projectKey: string},
  parameters: ReadCustomerGroupByIdParameters
) {
  try {
    const {id, expand = []} = parameters;
    const request = apiRoot
      .withProjectKey({projectKey: context.projectKey})
      .customerGroups()
      .withId({ID: id});

    // Add expansions if provided
    if (expand.length > 0) {
      const response = await request
        .get({
          queryArgs: {
            expand,
          },
        })
        .execute();
      return response.body;
    } else {
      const response = await request.get().execute();
      return response.body;
    }
  } catch (error) {
    throw new SDKError('Error fetching customer group by ID', error);
  }
}

/**
 * Fetches a customer group by its key
 */
export async function getCustomerGroupByKey(
  apiRoot: ApiRoot,
  context: {projectKey: string},
  parameters: ReadCustomerGroupByKeyParameters
) {
  try {
    const {key, expand = []} = parameters;
    const request = apiRoot
      .withProjectKey({projectKey: context.projectKey})
      .customerGroups()
      .withKey({key});

    // Add expansions if provided
    if (expand.length > 0) {
      const response = await request
        .get({
          queryArgs: {
            expand,
          },
        })
        .execute();
      return response.body;
    } else {
      const response = await request.get().execute();
      return response.body;
    }
  } catch (error) {
    throw new SDKError('Error fetching customer group by key', error);
  }
}

/**
 * Queries customer groups based on provided parameters
 */
export async function queryCustomerGroups(
  apiRoot: ApiRoot,
  context: {projectKey: string},
  parameters: QueryCustomerGroupsParameters
) {
  try {
    const {where = [], sort = [], limit, offset, expand = []} = parameters;

    const queryArgs: Record<string, any> = {};

    if (where.length > 0) {
      queryArgs.where = where;
    }

    if (sort.length > 0) {
      queryArgs.sort = sort;
    }

    if (limit !== undefined) {
      queryArgs.limit = limit;
    }

    if (offset !== undefined) {
      queryArgs.offset = offset;
    }

    if (expand.length > 0) {
      queryArgs.expand = expand;
    }

    const response = await apiRoot
      .withProjectKey({projectKey: context.projectKey})
      .customerGroups()
      .get({
        queryArgs,
      })
      .execute();

    return response.body;
  } catch (error) {
    throw new SDKError('Error querying customer groups', error);
  }
}

/**
 * Creates a new customer group
 */
export async function createCustomerGroup(
  apiRoot: ApiRoot,
  context: {projectKey: string},
  parameters: CreateCustomerGroupParameters
) {
  try {
    const response = await apiRoot
      .withProjectKey({projectKey: context.projectKey})
      .customerGroups()
      .post({
        body: {
          ...parameters,
        },
      })
      .execute();

    return response.body;
  } catch (error) {
    throw new SDKError('Error creating customer group', error);
  }
}

/**
 * Updates a customer group by its ID
 */
export async function updateCustomerGroupById(
  apiRoot: ApiRoot,
  context: {projectKey: string},
  parameters: UpdateCustomerGroupByIdParameters
) {
  try {
    const {id, version, actions} = parameters;

    const response = await apiRoot
      .withProjectKey({projectKey: context.projectKey})
      .customerGroups()
      .withId({ID: id})
      .post({
        body: {
          version,
          actions,
        },
      })
      .execute();

    return response.body;
  } catch (error) {
    throw new SDKError('Error updating customer group by ID', error);
  }
}

/**
 * Updates a customer group by its key
 */
export async function updateCustomerGroupByKey(
  apiRoot: ApiRoot,
  context: {projectKey: string},
  parameters: UpdateCustomerGroupByKeyParameters
) {
  try {
    const {key, version, actions} = parameters;

    const response = await apiRoot
      .withProjectKey({projectKey: context.projectKey})
      .customerGroups()
      .withKey({key})
      .post({
        body: {
          version,
          actions,
        },
      })
      .execute();

    return response.body;
  } catch (error) {
    throw new SDKError('Error updating customer group by key', error);
  }
}
