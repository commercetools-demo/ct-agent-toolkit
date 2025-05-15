import CommercetoolsAgentToolkit from '../toolkit';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import CommercetoolsAPI from '../../shared/api';
import { isToolAllowed } from '../../shared/configuration';

// Mock dependencies
jest.mock('@modelcontextprotocol/sdk/server/mcp.js');
jest.mock('../../shared/api');
jest.mock('../../shared/configuration');

jest.mock('../../shared/tools', () => {
  const { z: localZ } = require('zod'); // Require z inside the factory
  return [
    {
      method: 'mcpTool1',
      description: 'Description for MCP tool 1',
      parameters: localZ.object({ paramA: localZ.string().describe('Param A') }),
      namespace: 'cart',
      actions: [] as any[], 
      name: 'mcpTool1'
    },
    {
      method: 'mcpTool2',
      description: 'Description for MCP tool 2',
      parameters: localZ.object({ paramB: localZ.number().describe('Param B') }),
      namespace: 'product',
      actions: [] as any[],
      name: 'mcpTool2'
    },
  ];
});

let mockSharedToolsData: any[]; // To hold the data for assertions

describe('CommercetoolsAgentToolkit (ModelContextProtocol)', () => {
  const mockConfiguration = { enabledTools: ['cart', 'product.mcpTool2'] } as any;
  let mockCommercetoolsAPIInstance: jest.Mocked<CommercetoolsAPI>;
  let mockMcpServerInstance: jest.Mocked<McpServer>;

  beforeAll(() => {
    // Load the mocked definitions for use in tests
    mockSharedToolsData = require('../../shared/tools');
  });

  beforeEach(() => {
    // Reset mocks
    (McpServer as jest.Mock).mockClear();
    (CommercetoolsAPI as jest.Mock).mockClear();
    (isToolAllowed as jest.Mock).mockClear();

    // Setup mock instances and implementations
    mockMcpServerInstance = {
      tool: jest.fn(), 
    } as unknown as jest.Mocked<McpServer>; 
    (McpServer as jest.Mock).mockImplementation(() => mockMcpServerInstance);

    mockCommercetoolsAPIInstance = new CommercetoolsAPI('c','s','a','p','a') as jest.Mocked<CommercetoolsAPI>;
    mockCommercetoolsAPIInstance.run = jest.fn(); 
    (CommercetoolsAPI as jest.Mock).mockImplementation(() => mockCommercetoolsAPIInstance);

    (isToolAllowed as jest.Mock).mockImplementation((tool, config) => {
        if (tool.method === 'mcpTool1' && config.enabledTools.includes('cart')) return true;
        if (tool.method === 'mcpTool2' && config.enabledTools.includes('product.mcpTool2')) return true;
        return false;
      }
    );
  });

  it('should call McpServer constructor with correct parameters', () => {
    new CommercetoolsAgentToolkit({
      clientId: 'id', clientSecret: 'secret', authUrl: 'auth', projectKey: 'key', apiUrl: 'api', configuration: mockConfiguration,
    });
    expect(McpServer).toHaveBeenCalledWith({
      name: 'Commercetools',
      version: '0.4.0',
    });
  });

  it('should initialize CommercetoolsAPI', () => {
    new CommercetoolsAgentToolkit({
      clientId: 'id', clientSecret: 'secret', authUrl: 'auth', projectKey: 'key', apiUrl: 'api', configuration: mockConfiguration,
    });
    expect(CommercetoolsAPI).toHaveBeenCalledWith('id', 'secret', 'auth', 'key', 'api');
  });

  it('should filter tools and register allowed tools with McpServer', () => {
    new CommercetoolsAgentToolkit({
      clientId: 'id', clientSecret: 'secret', authUrl: 'auth', projectKey: 'key', apiUrl: 'api', configuration: mockConfiguration,
    });

    expect(isToolAllowed).toHaveBeenCalledTimes(mockSharedToolsData.length);
    expect(mockMcpServerInstance.tool).toHaveBeenCalledTimes(2); // mcpTool1 and mcpTool2

    expect(mockMcpServerInstance.tool).toHaveBeenCalledWith(
      mockSharedToolsData[0].method,
      mockSharedToolsData[0].description,
      mockSharedToolsData[0].parameters.shape,
      expect.any(Function) // Handler function
    );
    expect(mockMcpServerInstance.tool).toHaveBeenCalledWith(
      mockSharedToolsData[1].method,
      mockSharedToolsData[1].description,
      mockSharedToolsData[1].parameters.shape,
      expect.any(Function) // Handler function
    );
  });

  it('handler function should call commercetoolsAPI.run and format result', async () => {
    new CommercetoolsAgentToolkit({
      clientId: 'id', clientSecret: 'secret', authUrl: 'auth', projectKey: 'key', apiUrl: 'api', configuration: mockConfiguration,
    });

    // Assuming mcpTool1 was allowed and registered
    const toolCallArgs = (mockMcpServerInstance.tool as jest.Mock).mock.calls[0];
    const handler = toolCallArgs[3]; // The async handler function
    const toolMethod = toolCallArgs[0];

    const handlerArg = { paramA: 'testValue' };
    const apiResult = { data: 'api success' };
    mockCommercetoolsAPIInstance.run.mockResolvedValue(apiResult as any); // Cast to any here

    const result = await handler(handlerArg, {}); // {} for _extra

    expect(mockCommercetoolsAPIInstance.run).toHaveBeenCalledWith(toolMethod, handlerArg);
    expect(result).toEqual({
      content: [
        {
          type: 'text',
          text: String(apiResult),
        },
      ],
    });
  });

   it('should correctly handle no tools being allowed', () => {
    (isToolAllowed as jest.Mock).mockReturnValue(false); // Disallow all tools
    new CommercetoolsAgentToolkit({
        clientId: 'id', clientSecret: 'secret', authUrl: 'auth', projectKey: 'key', apiUrl: 'api', configuration: {enabledTools:[]} as any,
      });

    expect(isToolAllowed).toHaveBeenCalledTimes(mockSharedToolsData.length);
    expect(mockMcpServerInstance.tool).not.toHaveBeenCalled();
  });
}); 