import {readProject} from '../../../shared/project/functions';

interface ErrorWithStatusCode extends Error {
  statusCode?: number;
}

describe('readProject', () => {
  let mockApiRoot: any;
  let mockContext: any;
  let mockExecute: jest.Mock;
  let mockGet: jest.Mock;
  let mockWithProjectKey: jest.Mock;
  
  beforeEach(() => {
    mockExecute = jest.fn();
    mockGet = jest.fn().mockReturnValue({execute: mockExecute});
    mockWithProjectKey = jest.fn().mockReturnValue({get: mockGet});
    
    mockApiRoot = {
      withProjectKey: mockWithProjectKey,
    };
    
    mockContext = {
      projectKey: 'test-project',
    };
    
    mockExecute.mockResolvedValue({
      body: {
        key: 'test-project',
        name: 'Test Project',
        countries: ['US', 'DE'],
        currencies: ['USD', 'EUR'],
        languages: ['en', 'de'],
      },
    });
  });
  
  it('should read project information', async () => {
    const params = {};
    const result = await readProject(mockApiRoot, mockContext, params);
    
    expect(mockWithProjectKey).toHaveBeenCalledWith('test-project');
    expect(mockGet).toHaveBeenCalled();
    expect(mockExecute).toHaveBeenCalled();
    
    expect(result).toEqual({
      key: 'test-project',
      name: 'Test Project',
      countries: ['US', 'DE'],
      currencies: ['USD', 'EUR'],
      languages: ['en', 'de'],
    });
  });
  
  it('should use provided projectKey if available', async () => {
    const params = {projectKey: 'custom-project'};
    await readProject(mockApiRoot, mockContext, params);
    
    expect(mockWithProjectKey).toHaveBeenCalledWith('custom-project');
  });
  
  it('should throw an error when API request fails', async () => {
    const error = new Error('API Error') as ErrorWithStatusCode;
    error.statusCode = 404;
    mockExecute.mockRejectedValue(error);
    
    const params = {};
    await expect(readProject(mockApiRoot, mockContext, params)).rejects.toThrow(
      'Failed to read project: API Error (404)'
    );
  });
}); 