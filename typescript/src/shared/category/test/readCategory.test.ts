import {readCategory} from '../functions';

describe('readCategory', () => {
  it('should fetch a category by ID', async () => {
    const mockApiRoot = {
      withProjectKey: jest.fn(() => ({
        categories: jest.fn(() => ({
          withId: jest.fn(() => ({
            get: jest.fn(() => ({
              execute: jest.fn().mockResolvedValue({
                body: {id: 'test-id', name: {en: 'Test Category'}},
              }),
            })),
          })),
        })),
      })),
    };

    const result = await readCategory(
      mockApiRoot as any,
      {projectKey: 'test-project'},
      {id: 'test-id'}
    );

    expect(result).toEqual({id: 'test-id', name: {en: 'Test Category'}});
    expect(mockApiRoot.withProjectKey).toHaveBeenCalledWith({
      projectKey: 'test-project',
    });
  });

  it('should fetch a category by key', async () => {
    const mockApiRoot = {
      withProjectKey: jest.fn(() => ({
        categories: jest.fn(() => ({
          withKey: jest.fn(() => ({
            get: jest.fn(() => ({
              execute: jest.fn().mockResolvedValue({
                body: {
                  id: 'test-id',
                  key: 'test-key',
                  name: {en: 'Test Category'},
                },
              }),
            })),
          })),
        })),
      })),
    };

    const result = await readCategory(
      mockApiRoot as any,
      {projectKey: 'test-project'},
      {key: 'test-key'}
    );

    expect(result).toEqual({
      id: 'test-id',
      key: 'test-key',
      name: {en: 'Test Category'},
    });
    expect(mockApiRoot.withProjectKey).toHaveBeenCalledWith({
      projectKey: 'test-project',
    });
  });

  it('should fetch a list of categories with query parameters', async () => {
    const mockApiRoot = {
      withProjectKey: jest.fn(() => ({
        categories: jest.fn(() => ({
          get: jest.fn(() => ({
            execute: jest.fn().mockResolvedValue({
              body: {
                results: [
                  {id: 'test-id-1', name: {en: 'Test Category 1'}},
                  {id: 'test-id-2', name: {en: 'Test Category 2'}},
                ],
                total: 2,
              },
            }),
          })),
        })),
      })),
    };

    const result = await readCategory(
      mockApiRoot as any,
      {projectKey: 'test-project'},
      {
        limit: 10,
        offset: 0,
        sort: ['name.en asc'],
        where: ['name(en = "Test Category")'],
      }
    );

    expect(result).toEqual({
      results: [
        {id: 'test-id-1', name: {en: 'Test Category 1'}},
        {id: 'test-id-2', name: {en: 'Test Category 2'}},
      ],
      total: 2,
    });
    expect(mockApiRoot.withProjectKey).toHaveBeenCalledWith({
      projectKey: 'test-project',
    });
  });

  it('should handle errors properly', async () => {
    const mockApiRoot = {
      withProjectKey: jest.fn(() => ({
        categories: jest.fn(() => ({
          get: jest.fn(() => ({
            execute: jest.fn().mockRejectedValue(new Error('API Error')),
          })),
        })),
      })),
    };

    await expect(
      readCategory(mockApiRoot as any, {projectKey: 'test-project'}, {})
    ).rejects.toThrow('Failed to read category: API Error');
  });
});
