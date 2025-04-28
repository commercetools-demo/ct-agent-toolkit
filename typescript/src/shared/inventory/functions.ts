import {ApiRoot} from '@commercetools/platform-sdk';
import {z} from 'zod';
import {
  createInventoryParameters,
  readInventoryParameters,
  updateInventoryParameters,
} from './parameters';

/**
 * Reads inventory entries based on provided parameters:
 * - If 'id' is provided, retrieves a specific inventory entry by ID
 * - If 'key' is provided, retrieves a specific inventory entry by key
 * - If neither 'id' nor 'key' is provided, lists inventory entries with optional filtering
 */
export async function readInventory(
  apiRoot: ApiRoot,
  context: {projectKey: string},
  params: z.infer<typeof readInventoryParameters>
) {
  try {
    const {id, key, limit, offset, sort, where, expand} = params;

    if (id) {
      // Get inventory entry by ID
      const inventoryRequest = apiRoot
        .withProjectKey({projectKey: context.projectKey})
        .inventory()
        .withId({ID: id})
        .get({
          queryArgs: {
            expand,
          },
        });

      const response = await inventoryRequest.execute();
      return response.body;
    } else if (key) {
      // Get inventory entry by key
      const inventoryRequest = apiRoot
        .withProjectKey({projectKey: context.projectKey})
        .inventory()
        .withKey({key})
        .get({
          queryArgs: {
            expand,
          },
        });

      const response = await inventoryRequest.execute();
      return response.body;
    } else {
      // List inventory entries
      const inventoryRequest = apiRoot
        .withProjectKey({projectKey: context.projectKey})
        .inventory()
        .get({
          queryArgs: {
            limit,
            offset,
            sort,
            where,
            expand,
          },
        });

      const response = await inventoryRequest.execute();
      return response.body;
    }
  } catch (error) {
    console.error('Error reading inventory:', error);
    throw error;
  }
}

/**
 * Creates a new inventory entry
 */
export async function createInventory(
  apiRoot: ApiRoot,
  context: {projectKey: string},
  params: z.infer<typeof createInventoryParameters>
) {
  try {
    const inventoryDraft = {
      key: params.key,
      sku: params.sku,
      supplyChannel: params.supplyChannel,
      quantityOnStock: params.quantityOnStock,
      restockableInDays: params.restockableInDays,
      expectedDelivery: params.expectedDelivery,
      custom: params.custom,
    };

    const inventoryRequest = apiRoot
      .withProjectKey({projectKey: context.projectKey})
      .inventory()
      .post({
        body: inventoryDraft,
      });

    const response = await inventoryRequest.execute();
    return response.body;
  } catch (error) {
    console.error('Error creating inventory entry:', error);
    throw error;
  }
}

/**
 * Updates or deletes an inventory entry based on provided parameters:
 * - If 'id' is provided, updates/deletes the inventory entry by ID
 * - If 'key' is provided, updates/deletes the inventory entry by key
 * - One of either 'id' or 'key' must be provided
 * - If an action with type 'delete' is included, the entry will be deleted
 */
export async function updateInventory(
  apiRoot: ApiRoot,
  context: {projectKey: string},
  params: z.infer<typeof updateInventoryParameters>
) {
  try {
    const {id, key, version, actions} = params;

    // Check if we're deleting the inventory entry
    if (actions.some((action) => action.action === 'delete')) {
      if (id) {
        // Delete by ID
        const deleteRequest = apiRoot
          .withProjectKey({projectKey: context.projectKey})
          .inventory()
          .withId({ID: id})
          .delete({
            queryArgs: {
              version,
            },
          });

        const response = await deleteRequest.execute();
        return response.body;
      } else if (key) {
        // Delete by key
        const deleteRequest = apiRoot
          .withProjectKey({projectKey: context.projectKey})
          .inventory()
          .withKey({key})
          .delete({
            queryArgs: {
              version,
            },
          });

        const response = await deleteRequest.execute();
        return response.body;
      } else {
        throw new Error(
          'Either id or key must be provided for deleting an inventory entry'
        );
      }
    } else {
      // We're updating the inventory entry
      // Filter out any 'delete' actions
      const updateActions = actions.filter(
        (action) => action.action !== 'delete'
      );

      if (id) {
        // Update by ID
        const updateRequest = apiRoot
          .withProjectKey({projectKey: context.projectKey})
          .inventory()
          .withId({ID: id})
          .post({
            body: {
              version,
              actions: updateActions,
            },
          });

        const response = await updateRequest.execute();
        return response.body;
      } else if (key) {
        // Update by key
        const updateRequest = apiRoot
          .withProjectKey({projectKey: context.projectKey})
          .inventory()
          .withKey({key})
          .post({
            body: {
              version,
              actions: updateActions,
            },
          });

        const response = await updateRequest.execute();
        return response.body;
      } else {
        throw new Error(
          'Either id or key must be provided for updating an inventory entry'
        );
      }
    }
  } catch (error) {
    console.error('Error updating inventory entry:', error);
    throw error;
  }
}
