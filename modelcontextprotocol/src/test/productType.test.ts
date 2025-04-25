import {main, parseArgs} from '..';
import {CommercetoolsAgentToolkit} from '@commercetools-demo/ct-agent-toolkit/modelcontextprotocol';
import {StdioServerTransport} from '@modelcontextprotocol/sdk/server/stdio.js';

// Mock these imports
jest.mock('@commercetools-demo/ct-agent-toolkit/modelcontextprotocol');
jest.mock('@modelcontextprotocol/sdk/server/stdio.js');

describe('Product Type Tools', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env = {};
  });

  it('should initialize the server with product-type.read tool correctly', async () => {
    process.argv = [
      'node',
      'index.js',
      '--tools=product-type.read',
      '--clientId=test_client_id',
      '--clientSecret=test_client_secret',
      '--authUrl=https://auth.commercetools.com',
      '--projectKey=test_project',
      '--apiUrl=https://api.commercetools.com',
    ];

    await main();

    expect(CommercetoolsAgentToolkit).toHaveBeenCalledWith({
      clientId: 'test_client_id',
      clientSecret: 'test_client_secret',
      authUrl: 'https://auth.commercetools.com',
      projectKey: 'test_project',
      apiUrl: 'https://api.commercetools.com',
      configuration: {actions: {'product-type': {read: true}}},
    });

    expect(StdioServerTransport).toHaveBeenCalled();
  });

  it('should initialize the server with product-type.create tool correctly', async () => {
    process.argv = [
      'node',
      'index.js',
      '--tools=product-type.create',
      '--clientId=test_client_id',
      '--clientSecret=test_client_secret',
      '--authUrl=https://auth.commercetools.com',
      '--projectKey=test_project',
      '--apiUrl=https://api.commercetools.com',
    ];

    await main();

    expect(CommercetoolsAgentToolkit).toHaveBeenCalledWith({
      clientId: 'test_client_id',
      clientSecret: 'test_client_secret',
      authUrl: 'https://auth.commercetools.com',
      projectKey: 'test_project',
      apiUrl: 'https://api.commercetools.com',
      configuration: {actions: {'product-type': {create: true}}},
    });
  });

  it('should initialize the server with product-type.update tool correctly', async () => {
    process.argv = [
      'node',
      'index.js',
      '--tools=product-type.update',
      '--clientId=test_client_id',
      '--clientSecret=test_client_secret',
      '--authUrl=https://auth.commercetools.com',
      '--projectKey=test_project',
      '--apiUrl=https://api.commercetools.com',
    ];

    await main();

    expect(CommercetoolsAgentToolkit).toHaveBeenCalledWith({
      clientId: 'test_client_id',
      clientSecret: 'test_client_secret',
      authUrl: 'https://auth.commercetools.com',
      projectKey: 'test_project',
      apiUrl: 'https://api.commercetools.com',
      configuration: {actions: {'product-type': {update: true}}},
    });
  });

  it('should initialize the server with multiple product-type tools correctly', async () => {
    process.argv = [
      'node',
      'index.js',
      '--tools=product-type.read,product-type.create,product-type.update',
      '--clientId=test_client_id',
      '--clientSecret=test_client_secret',
      '--authUrl=https://auth.commercetools.com',
      '--projectKey=test_project',
      '--apiUrl=https://api.commercetools.com',
    ];

    await main();

    expect(CommercetoolsAgentToolkit).toHaveBeenCalledWith({
      clientId: 'test_client_id',
      clientSecret: 'test_client_secret',
      authUrl: 'https://auth.commercetools.com',
      projectKey: 'test_project',
      apiUrl: 'https://api.commercetools.com',
      configuration: {
        actions: {'product-type': {read: true, create: true, update: true}},
      },
    });
  });
});
