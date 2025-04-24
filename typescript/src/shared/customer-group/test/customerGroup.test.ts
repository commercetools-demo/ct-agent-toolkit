import {
  getCustomerGroupById,
  getCustomerGroupByKey,
  queryCustomerGroups,
  createCustomerGroup,
  updateCustomerGroupById,
  updateCustomerGroupByKey,
  CustomerGroupUpdateAction,
} from '../functions';
import {ApiRoot} from '@commercetools/platform-sdk';

// Mock ApiRoot for testing
const mockExecute = jest.fn();
const mockGet = jest.fn(() => ({execute: mockExecute}));
const mockPost = jest.fn(() => ({execute: mockExecute}));
const mockWithId = jest.fn(() => ({get: mockGet, post: mockPost}));
const mockWithKey = jest.fn(() => ({get: mockGet, post: mockPost}));
const mockCustomerGroups = jest.fn(() => ({
  get: mockGet,
  post: mockPost,
  withId: mockWithId,
  withKey: mockWithKey,
}));
const mockWithProjectKey = jest.fn(() => ({
  customerGroups: mockCustomerGroups,
}));

const mockApiRoot = {
  withProjectKey: mockWithProjectKey,
} as unknown as ApiRoot;

const mockContext = {projectKey: 'test-project'};

describe('CustomerGroup Functions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getCustomerGroupById', () => {
    it('should fetch a customer group by ID', async () => {
      const mockResponse = {
        body: {id: 'group-id', name: 'Test Group'},
      };
      mockExecute.mockResolvedValueOnce(mockResponse);

      const result = await getCustomerGroupById(mockApiRoot, mockContext, {
        id: 'group-id',
      });

      expect(mockWithProjectKey).toHaveBeenCalledWith({
        projectKey: 'test-project',
      });
      expect(mockCustomerGroups).toHaveBeenCalled();
      expect(mockWithId).toHaveBeenCalledWith({ID: 'group-id'});
      expect(mockGet).toHaveBeenCalled();
      expect(mockExecute).toHaveBeenCalled();
      expect(result).toEqual(mockResponse.body);
    });

    it('should fetch a customer group by ID with expansions', async () => {
      const mockResponse = {
        body: {id: 'group-id', name: 'Test Group'},
      };
      mockExecute.mockResolvedValueOnce(mockResponse);

      const result = await getCustomerGroupById(mockApiRoot, mockContext, {
        id: 'group-id',
        expand: ['custom.type'],
      });

      expect(mockWithProjectKey).toHaveBeenCalledWith({
        projectKey: 'test-project',
      });
      expect(mockCustomerGroups).toHaveBeenCalled();
      expect(mockWithId).toHaveBeenCalledWith({ID: 'group-id'});
      expect(mockGet).toHaveBeenCalledWith({
        queryArgs: {expand: ['custom.type']},
      });
      expect(mockExecute).toHaveBeenCalled();
      expect(result).toEqual(mockResponse.body);
    });
  });

  describe('getCustomerGroupByKey', () => {
    it('should fetch a customer group by key', async () => {
      const mockResponse = {
        body: {id: 'group-id', key: 'group-key', name: 'Test Group'},
      };
      mockExecute.mockResolvedValueOnce(mockResponse);

      const result = await getCustomerGroupByKey(mockApiRoot, mockContext, {
        key: 'group-key',
      });

      expect(mockWithProjectKey).toHaveBeenCalledWith({
        projectKey: 'test-project',
      });
      expect(mockCustomerGroups).toHaveBeenCalled();
      expect(mockWithKey).toHaveBeenCalledWith({key: 'group-key'});
      expect(mockGet).toHaveBeenCalled();
      expect(mockExecute).toHaveBeenCalled();
      expect(result).toEqual(mockResponse.body);
    });
  });

  describe('queryCustomerGroups', () => {
    it('should query customer groups', async () => {
      const mockResponse = {
        body: {
          results: [
            {id: 'group-1', name: 'Group 1'},
            {id: 'group-2', name: 'Group 2'},
          ],
        },
      };
      mockExecute.mockResolvedValueOnce(mockResponse);

      const result = await queryCustomerGroups(mockApiRoot, mockContext, {
        where: ['name="Group 1"'],
        sort: ['name asc'],
        limit: 10,
        offset: 0,
      });

      expect(mockWithProjectKey).toHaveBeenCalledWith({
        projectKey: 'test-project',
      });
      expect(mockCustomerGroups).toHaveBeenCalled();
      expect(mockGet).toHaveBeenCalledWith({
        queryArgs: {
          where: ['name="Group 1"'],
          sort: ['name asc'],
          limit: 10,
          offset: 0,
        },
      });
      expect(mockExecute).toHaveBeenCalled();
      expect(result).toEqual(mockResponse.body);
    });
  });

  describe('createCustomerGroup', () => {
    it('should create a customer group', async () => {
      const mockResponse = {
        body: {
          id: 'new-group-id',
          name: 'New Group',
        },
      };
      mockExecute.mockResolvedValueOnce(mockResponse);

      const parameters = {
        groupName: 'New Group',
        key: 'new-group',
      };

      const result = await createCustomerGroup(
        mockApiRoot,
        mockContext,
        parameters
      );

      expect(mockWithProjectKey).toHaveBeenCalledWith({
        projectKey: 'test-project',
      });
      expect(mockCustomerGroups).toHaveBeenCalled();
      expect(mockPost).toHaveBeenCalledWith({
        body: parameters,
      });
      expect(mockExecute).toHaveBeenCalled();
      expect(result).toEqual(mockResponse.body);
    });
  });

  describe('updateCustomerGroupById', () => {
    it('should update a customer group by ID', async () => {
      const mockResponse = {
        body: {
          id: 'group-id',
          version: 2,
          name: 'Updated Group',
        },
      };
      mockExecute.mockResolvedValueOnce(mockResponse);

      const actions: CustomerGroupUpdateAction[] = [
        {
          action: 'changeName',
          name: 'Updated Group',
        },
      ];

      const parameters = {
        id: 'group-id',
        version: 1,
        actions,
      };

      const result = await updateCustomerGroupById(
        mockApiRoot,
        mockContext,
        parameters
      );

      expect(mockWithProjectKey).toHaveBeenCalledWith({
        projectKey: 'test-project',
      });
      expect(mockCustomerGroups).toHaveBeenCalled();
      expect(mockWithId).toHaveBeenCalledWith({ID: 'group-id'});
      expect(mockPost).toHaveBeenCalledWith({
        body: {
          version: 1,
          actions,
        },
      });
      expect(mockExecute).toHaveBeenCalled();
      expect(result).toEqual(mockResponse.body);
    });
  });

  describe('updateCustomerGroupByKey', () => {
    it('should update a customer group by key', async () => {
      const mockResponse = {
        body: {
          id: 'group-id',
          key: 'group-key',
          version: 2,
          name: 'Updated Group',
        },
      };
      mockExecute.mockResolvedValueOnce(mockResponse);

      const actions: CustomerGroupUpdateAction[] = [
        {
          action: 'changeName',
          name: 'Updated Group',
        },
      ];

      const parameters = {
        key: 'group-key',
        version: 1,
        actions,
      };

      const result = await updateCustomerGroupByKey(
        mockApiRoot,
        mockContext,
        parameters
      );

      expect(mockWithProjectKey).toHaveBeenCalledWith({
        projectKey: 'test-project',
      });
      expect(mockCustomerGroups).toHaveBeenCalled();
      expect(mockWithKey).toHaveBeenCalledWith({key: 'group-key'});
      expect(mockPost).toHaveBeenCalledWith({
        body: {
          version: 1,
          actions,
        },
      });
      expect(mockExecute).toHaveBeenCalled();
      expect(result).toEqual(mockResponse.body);
    });
  });

  describe('Error handling', () => {
    it('should throw an error when getCustomerGroupById fails', async () => {
      mockExecute.mockRejectedValueOnce(new Error('API Error'));

      await expect(
        getCustomerGroupById(mockApiRoot, mockContext, {id: 'group-id'})
      ).rejects.toThrow('Error fetching customer group by ID');
    });

    it('should throw an error when createCustomerGroup fails', async () => {
      mockExecute.mockRejectedValueOnce(new Error('API Error'));

      await expect(
        createCustomerGroup(mockApiRoot, mockContext, {groupName: 'New Group'})
      ).rejects.toThrow('Error creating customer group');
    });
  });
});
