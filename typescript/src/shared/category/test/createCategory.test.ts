import {createCategory} from '../functions';

describe('createCategory', () => {
  it('should create a category successfully', async () => {
    const mockApiRoot = {
      withProjectKey: jest.fn(() => ({
        categories: jest.fn(() => ({
          post: jest.fn(() => ({
            execute: jest.fn().mockResolvedValue({
              body: {
                id: 'new-category-id',
                name: {en: 'New Category'},
                slug: {en: 'new-category'},
              },
            }),
          })),
        })),
      })),
    };

    const categoryDraft = {
      name: {en: 'New Category'},
      slug: {en: 'new-category'},
    };

    const result = await createCategory(
      mockApiRoot as any,
      {projectKey: 'test-project'},
      categoryDraft
    );

    expect(result).toEqual({
      id: 'new-category-id',
      name: {en: 'New Category'},
      slug: {en: 'new-category'},
    });
    expect(mockApiRoot.withProjectKey).toHaveBeenCalledWith({
      projectKey: 'test-project',
    });
  });

  it('should handle errors properly', async () => {
    const mockApiRoot = {
      withProjectKey: jest.fn(() => ({
        categories: jest.fn(() => ({
          post: jest.fn(() => ({
            execute: jest.fn().mockRejectedValue(new Error('API Error')),
          })),
        })),
      })),
    };

    const categoryDraft = {
      name: {en: 'New Category'},
      slug: {en: 'new-category'},
    };

    await expect(
      createCategory(
        mockApiRoot as any,
        {projectKey: 'test-project'},
        categoryDraft
      )
    ).rejects.toThrow('Failed to create category');
  });
});
