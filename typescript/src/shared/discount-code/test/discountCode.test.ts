import {
  readDiscountCode,
  listDiscountCodes,
  createDiscountCode,
  updateDiscountCode,
} from '../functions';

// Mock for ApiRoot
const mockApiRoot = {
  withProjectKey: jest.fn().mockReturnThis(),
  discountCodes: jest.fn().mockReturnThis(),
  withId: jest.fn().mockReturnThis(),
  withKey: jest.fn().mockReturnThis(),
  get: jest.fn().mockReturnThis(),
  post: jest.fn().mockReturnThis(),
  execute: jest.fn(),
};

describe('Discount Code Functions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('readDiscountCode', () => {
    it('should read a discount code by ID', async () => {
      const mockDiscountCode = {
        id: 'discount-code-id',
        code: 'SAVE10',
        name: {en: 'Save 10%'},
      };

      mockApiRoot.execute.mockResolvedValueOnce({
        body: mockDiscountCode,
      });

      const result = await readDiscountCode(
        mockApiRoot as any,
        {projectKey: 'test-project'},
        {id: 'discount-code-id'}
      );

      expect(mockApiRoot.withProjectKey).toHaveBeenCalledWith({
        projectKey: 'test-project',
      });
      expect(mockApiRoot.discountCodes).toHaveBeenCalled();
      expect(mockApiRoot.withId).toHaveBeenCalledWith({
        ID: 'discount-code-id',
      });
      expect(mockApiRoot.get).toHaveBeenCalled();
      expect(mockApiRoot.execute).toHaveBeenCalled();
      expect(result).toEqual(mockDiscountCode);
    });

    it('should read a discount code by key', async () => {
      const mockDiscountCode = {
        id: 'discount-code-id',
        key: 'save10_code',
        code: 'SAVE10',
        name: {en: 'Save 10%'},
      };

      mockApiRoot.execute.mockResolvedValueOnce({
        body: mockDiscountCode,
      });

      const result = await readDiscountCode(
        mockApiRoot as any,
        {projectKey: 'test-project'},
        {key: 'save10_code'}
      );

      expect(mockApiRoot.withProjectKey).toHaveBeenCalledWith({
        projectKey: 'test-project',
      });
      expect(mockApiRoot.discountCodes).toHaveBeenCalled();
      expect(mockApiRoot.withKey).toHaveBeenCalledWith({
        key: 'save10_code',
      });
      expect(mockApiRoot.get).toHaveBeenCalled();
      expect(mockApiRoot.execute).toHaveBeenCalled();
      expect(result).toEqual(mockDiscountCode);
    });

    it('should throw an error if neither id nor key is provided', async () => {
      await expect(
        readDiscountCode(mockApiRoot as any, {projectKey: 'test-project'}, {})
      ).rejects.toThrow('Failed to read discount code');
    });
  });

  describe('listDiscountCodes', () => {
    it('should list discount codes', async () => {
      const mockDiscountCodes = {
        results: [
          {
            id: 'discount-code-id-1',
            code: 'SAVE10',
            name: {en: 'Save 10%'},
          },
          {
            id: 'discount-code-id-2',
            code: 'SAVE20',
            name: {en: 'Save 20%'},
          },
        ],
      };

      mockApiRoot.execute.mockResolvedValueOnce({
        body: mockDiscountCodes,
      });

      const result = await listDiscountCodes(
        mockApiRoot as any,
        {projectKey: 'test-project'},
        {limit: 20}
      );

      expect(mockApiRoot.withProjectKey).toHaveBeenCalledWith({
        projectKey: 'test-project',
      });
      expect(mockApiRoot.discountCodes).toHaveBeenCalled();
      expect(mockApiRoot.get).toHaveBeenCalledWith({
        queryArgs: {limit: 20},
      });
      expect(mockApiRoot.execute).toHaveBeenCalled();
      expect(result).toEqual(mockDiscountCodes);
    });
  });

  describe('createDiscountCode', () => {
    it('should create a discount code', async () => {
      const mockDiscountCode = {
        id: 'new-discount-code-id',
        code: 'SAVE10',
        name: {en: 'Save 10%'},
        cartDiscounts: [
          {
            typeId: 'cart-discount',
            id: 'cart-discount-id',
          },
        ],
      };

      mockApiRoot.execute.mockResolvedValueOnce({
        body: mockDiscountCode,
      });

      const params = {
        code: 'SAVE10',
        name: {en: 'Save 10%'},
        isActive: true,
        cartDiscounts: [
          {
            typeId: 'cart-discount' as const,
            id: 'cart-discount-id',
          },
        ],
      };

      const result = await createDiscountCode(
        mockApiRoot as any,
        {projectKey: 'test-project'},
        params
      );

      expect(mockApiRoot.withProjectKey).toHaveBeenCalledWith({
        projectKey: 'test-project',
      });
      expect(mockApiRoot.discountCodes).toHaveBeenCalled();
      expect(mockApiRoot.post).toHaveBeenCalledWith({
        body: params,
      });
      expect(mockApiRoot.execute).toHaveBeenCalled();
      expect(result).toEqual(mockDiscountCode);
    });
  });

  describe('updateDiscountCode', () => {
    it('should update a discount code by ID', async () => {
      const mockUpdatedDiscountCode = {
        id: 'discount-code-id',
        version: 2,
        code: 'SAVE10',
        name: {en: 'Save 10% Updated'},
      };

      mockApiRoot.execute.mockResolvedValueOnce({
        body: mockUpdatedDiscountCode,
      });

      const params = {
        id: 'discount-code-id',
        version: 1,
        actions: [
          {
            action: 'changeName',
            name: {en: 'Save 10% Updated'},
          },
        ],
      };

      const result = await updateDiscountCode(
        mockApiRoot as any,
        {projectKey: 'test-project'},
        params
      );

      expect(mockApiRoot.withProjectKey).toHaveBeenCalledWith({
        projectKey: 'test-project',
      });
      expect(mockApiRoot.discountCodes).toHaveBeenCalled();
      expect(mockApiRoot.withId).toHaveBeenCalledWith({
        ID: 'discount-code-id',
      });
      expect(mockApiRoot.post).toHaveBeenCalledWith({
        body: {
          version: 1,
          actions: [
            {
              action: 'changeName',
              name: {en: 'Save 10% Updated'},
            },
          ],
        },
      });
      expect(mockApiRoot.execute).toHaveBeenCalled();
      expect(result).toEqual(mockUpdatedDiscountCode);
    });

    it('should update a discount code by key', async () => {
      const mockUpdatedDiscountCode = {
        id: 'discount-code-id',
        key: 'save10_code',
        version: 2,
        code: 'SAVE10',
        name: {en: 'Save 10% Updated'},
      };

      mockApiRoot.execute.mockResolvedValueOnce({
        body: mockUpdatedDiscountCode,
      });

      const params = {
        key: 'save10_code',
        version: 1,
        actions: [
          {
            action: 'changeName',
            name: {en: 'Save 10% Updated'},
          },
        ],
      };

      const result = await updateDiscountCode(
        mockApiRoot as any,
        {projectKey: 'test-project'},
        params
      );

      expect(mockApiRoot.withProjectKey).toHaveBeenCalledWith({
        projectKey: 'test-project',
      });
      expect(mockApiRoot.discountCodes).toHaveBeenCalled();
      expect(mockApiRoot.withKey).toHaveBeenCalledWith({
        key: 'save10_code',
      });
      expect(mockApiRoot.post).toHaveBeenCalledWith({
        body: {
          version: 1,
          actions: [
            {
              action: 'changeName',
              name: {en: 'Save 10% Updated'},
            },
          ],
        },
      });
      expect(mockApiRoot.execute).toHaveBeenCalled();
      expect(result).toEqual(mockUpdatedDiscountCode);
    });

    it('should throw an error if neither id nor key is provided', async () => {
      await expect(
        updateDiscountCode(
          mockApiRoot as any,
          {projectKey: 'test-project'},
          {version: 1, actions: []}
        )
      ).rejects.toThrow('Failed to update discount code');
    });
  });
});
