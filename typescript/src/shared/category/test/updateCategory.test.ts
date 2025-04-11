import {updateCategory} from '../functions';

describe('updateCategory', () => {
  it('should update a category by ID successfully', async () => {
    const mockApiRoot = {
      withProjectKey: jest.fn(() => ({
        categories: jest.fn(() => ({
          withId: jest.fn(() => ({
            post: jest.fn(() => ({
              execute: jest.fn().mockResolvedValue({
                body: {
                  id: 'test-id',
                  version: 2,
                  name: {en: 'Updated Category'},
                },
              }),
            })),
          })),
        })),
      })),
    };

    const updateRequest = {
      id: 'test-id',
      version: 1,
      actions: [
        {
          action: 'changeName',
          name: {en: 'Updated Category'},
        },
      ],
    };

    const result = await updateCategory(
      mockApiRoot as any,
      {projectKey: 'test-project'},
      updateRequest
    );

    expect(result).toEqual({
      id: 'test-id',
      version: 2,
      name: {en: 'Updated Category'},
    });
    expect(mockApiRoot.withProjectKey).toHaveBeenCalledWith({
      projectKey: 'test-project',
    });
  });

  it('should update a category by key successfully', async () => {
    const mockApiRoot = {
      withProjectKey: jest.fn(() => ({
        categories: jest.fn(() => ({
          withKey: jest.fn(() => ({
            post: jest.fn(() => ({
              execute: jest.fn().mockResolvedValue({
                body: {
                  id: 'test-id',
                  key: 'test-key',
                  version: 2,
                  name: {en: 'Updated Category'},
                },
              }),
            })),
          })),
        })),
      })),
    };

    const updateRequest = {
      key: 'test-key',
      version: 1,
      actions: [
        {
          action: 'changeName',
          name: {en: 'Updated Category'},
        },
      ],
    };

    const result = await updateCategory(
      mockApiRoot as any,
      {projectKey: 'test-project'},
      updateRequest
    );

    expect(result).toEqual({
      id: 'test-id',
      key: 'test-key',
      version: 2,
      name: {en: 'Updated Category'},
    });
    expect(mockApiRoot.withProjectKey).toHaveBeenCalledWith({
      projectKey: 'test-project',
    });
  });

  it('should throw error when neither id nor key is provided', async () => {
    const mockApiRoot = {
      withProjectKey: jest.fn(),
    };

    const updateRequest = {
      version: 1,
      actions: [
        {
          action: 'changeName',
          name: {en: 'Updated Category'},
        },
      ],
    };

    await expect(
      updateCategory(
        mockApiRoot as any,
        {projectKey: 'test-project'},
        updateRequest
      )
    ).rejects.toThrow(
      'Either id or key must be provided for updating a category'
    );
  });

  it('should handle API errors properly', async () => {
    const mockApiRoot = {
      withProjectKey: jest.fn(() => ({
        categories: jest.fn(() => ({
          withId: jest.fn(() => ({
            post: jest.fn(() => ({
              execute: jest.fn().mockRejectedValue(new Error('API Error')),
            })),
          })),
        })),
      })),
    };

    const updateRequest = {
      id: 'test-id',
      version: 1,
      actions: [
        {
          action: 'changeName',
          name: {en: 'Updated Category'},
        },
      ],
    };

    await expect(
      updateCategory(
        mockApiRoot as any,
        {projectKey: 'test-project'},
        updateRequest
      )
    ).rejects.toThrow('Failed to update category: API Error');
  });
});
