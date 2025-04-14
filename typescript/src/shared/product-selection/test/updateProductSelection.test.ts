import {updateProductSelection} from '../functions';
import {ApiRoot} from '@commercetools/platform-sdk';

type MockApiRoot = {
  withProjectKey: jest.Mock;
  productSelections: jest.Mock;
  withId: jest.Mock;
  withKey: jest.Mock;
  post: jest.Mock;
  execute: jest.Mock;
};

describe('updateProductSelection', () => {
  let mockApiRoot: MockApiRoot;
  const mockContext = {projectKey: 'test-project'};

  beforeEach(() => {
    mockApiRoot = {
      withProjectKey: jest.fn().mockReturnThis(),
      productSelections: jest.fn().mockReturnThis(),
      withId: jest.fn().mockReturnThis(),
      withKey: jest.fn().mockReturnThis(),
      post: jest.fn().mockReturnThis(),
      execute: jest.fn().mockResolvedValue({
        body: {
          id: 'test-product-selection-id',
          version: 2,
          key: 'test-product-selection-key',
          name: {
            en: 'Updated Product Selection',
          },
          mode: 'Individual',
          productCount: 1,
          createdAt: '2024-04-08T00:00:00.000Z',
          lastModifiedAt: '2024-04-08T01:00:00.000Z',
        },
      }),
    };
  });

  it('should update a product selection by ID successfully', async () => {
    const params = {
      id: 'test-product-selection-id',
      version: 1,
      actions: [
        {
          action: 'changeName',
          name: {
            en: 'Updated Product Selection',
          },
        },
      ],
    };

    const result = await updateProductSelection(
      mockApiRoot as unknown as ApiRoot,
      mockContext,
      params
    );

    expect(mockApiRoot.withProjectKey).toHaveBeenCalledWith({
      projectKey: 'test-project',
    });
    expect(mockApiRoot.productSelections).toHaveBeenCalled();
    expect(mockApiRoot.withId).toHaveBeenCalledWith({
      ID: 'test-product-selection-id',
    });
    expect(mockApiRoot.post).toHaveBeenCalledWith({
      body: {
        version: 1,
        actions: [
          {
            action: 'changeName',
            name: {
              en: 'Updated Product Selection',
            },
          },
        ],
      },
    });
    expect(result).toEqual({
      id: 'test-product-selection-id',
      version: 2,
      key: 'test-product-selection-key',
      name: {
        en: 'Updated Product Selection',
      },
      mode: 'Individual',
      productCount: 1,
      createdAt: '2024-04-08T00:00:00.000Z',
      lastModifiedAt: '2024-04-08T01:00:00.000Z',
    });
  });

  it('should update a product selection by key successfully', async () => {
    const params = {
      key: 'test-product-selection-key',
      version: 1,
      actions: [
        {
          action: 'changeName',
          name: {
            en: 'Updated Product Selection',
          },
        },
      ],
    };

    const result = await updateProductSelection(
      mockApiRoot as unknown as ApiRoot,
      mockContext,
      params
    );

    expect(mockApiRoot.withProjectKey).toHaveBeenCalledWith({
      projectKey: 'test-project',
    });
    expect(mockApiRoot.productSelections).toHaveBeenCalled();
    expect(mockApiRoot.withKey).toHaveBeenCalledWith({
      key: 'test-product-selection-key',
    });
    expect(mockApiRoot.post).toHaveBeenCalledWith({
      body: {
        version: 1,
        actions: [
          {
            action: 'changeName',
            name: {
              en: 'Updated Product Selection',
            },
          },
        ],
      },
    });
    expect(result).toEqual({
      id: 'test-product-selection-id',
      version: 2,
      key: 'test-product-selection-key',
      name: {
        en: 'Updated Product Selection',
      },
      mode: 'Individual',
      productCount: 1,
      createdAt: '2024-04-08T00:00:00.000Z',
      lastModifiedAt: '2024-04-08T01:00:00.000Z',
    });
  });

  it('should update a product selection with multiple actions', async () => {
    const params = {
      id: 'test-product-selection-id',
      version: 1,
      actions: [
        {
          action: 'changeName',
          name: {
            en: 'Updated Product Selection',
          },
        },
        {
          action: 'setKey',
          key: 'updated-product-selection-key',
        },
        {
          action: 'addProduct',
          product: {
            id: 'test-product-id',
            typeId: 'product',
          },
        },
      ],
    };

    await updateProductSelection(
      mockApiRoot as unknown as ApiRoot,
      mockContext,
      params
    );

    expect(mockApiRoot.post).toHaveBeenCalledWith({
      body: {
        version: 1,
        actions: [
          {
            action: 'changeName',
            name: {
              en: 'Updated Product Selection',
            },
          },
          {
            action: 'setKey',
            key: 'updated-product-selection-key',
          },
          {
            action: 'addProduct',
            product: {
              id: 'test-product-id',
              typeId: 'product',
            },
          },
        ],
      },
    });
  });

  it('should throw an error when neither id nor key is provided', async () => {
    const params = {
      version: 1,
      actions: [
        {
          action: 'changeName',
          name: {
            en: 'Updated Product Selection',
          },
        },
      ],
    };

    await expect(
      updateProductSelection(
        mockApiRoot as unknown as ApiRoot,
        mockContext,
        params
      )
    ).rejects.toThrow('Either id or key must be provided');
  });

  it('should throw an error when the API call fails', async () => {
    const mockError = new Error('API Error');
    (mockApiRoot.execute as jest.Mock) = jest.fn().mockRejectedValue(mockError);

    const params = {
      id: 'test-product-selection-id',
      version: 1,
      actions: [
        {
          action: 'changeName',
          name: {
            en: 'Updated Product Selection',
          },
        },
      ],
    };

    await expect(
      updateProductSelection(
        mockApiRoot as unknown as ApiRoot,
        mockContext,
        params
      )
    ).rejects.toThrow('Failed to update ProductSelection: API Error');
  });
});
