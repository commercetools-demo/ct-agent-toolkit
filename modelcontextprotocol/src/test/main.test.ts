import {main} from '../index';
import {CommercetoolsAgentToolkit} from '@commercetools-demo/ct-agent-toolkit/modelcontextprotocol';
import {StdioServerTransport} from '@modelcontextprotocol/sdk/server/stdio.js';

jest.mock('@commercetools-demo/ct-agent-toolkit/modelcontextprotocol');
jest.mock('@modelcontextprotocol/sdk/server/stdio.js');

describe('main function', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize the server with tools=all correctly', async () => {
    process.argv = [
      'node',
      'index.js',
      '--tools=all',
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
        actions: {
          products: {read: true, create: true, update: true},
          project: {read: true},
          'product-search': {read: true},
          category: {read: true, create: true, update: true},
          'product-selection': {read: true, create: true, update: true},
          order: {read: true, create: true, update: true},
          cart: {read: true, create: true, update: true},
        },
      },
    });

    expect(StdioServerTransport).toHaveBeenCalled();
  });

  it('should initialize the server with specific tools correctly (products.read)', async () => {
    process.argv = [
      'node',
      'index.js',
      '--tools=products.read',
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
      configuration: {actions: {products: {read: true}}},
    });

    expect(StdioServerTransport).toHaveBeenCalled();
  });

  it('should initialize the server with specific tools correctly (products.create)', async () => {
    process.argv = [
      'node',
      'index.js',
      '--tools=products.create',
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
      configuration: {actions: {products: {create: true}}},
    });

    expect(StdioServerTransport).toHaveBeenCalled();
  });

  it('should initialize the server with specific tools correctly (products.update)', async () => {
    process.argv = [
      'node',
      'index.js',
      '--tools=products.update',
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
      configuration: {actions: {products: {update: true}}},
    });

    expect(StdioServerTransport).toHaveBeenCalled();
  });

  it('should initialize the server with specific tools correctly (project.read)', async () => {
    process.argv = [
      'node',
      'index.js',
      '--tools=project.read',
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
      configuration: {actions: {project: {read: true}}},
    });

    expect(StdioServerTransport).toHaveBeenCalled();
  });

  it('should initialize the server with specific tools correctly (product-search.read)', async () => {
    process.argv = [
      'node',
      'index.js',
      '--tools=product-search.read',
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
      configuration: {actions: {'product-search': {read: true}}},
    });

    expect(StdioServerTransport).toHaveBeenCalled();
  });

  it('should initialize the server with specific tools correctly (category.read)', async () => {
    process.argv = [
      'node',
      'index.js',
      '--tools=category.read',
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
      configuration: {actions: {category: {read: true}}},
    });

    expect(StdioServerTransport).toHaveBeenCalled();
  });

  it('should initialize the server with specific tools correctly (category.create)', async () => {
    process.argv = [
      'node',
      'index.js',
      '--tools=category.create',
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
      configuration: {actions: {category: {create: true}}},
    });

    expect(StdioServerTransport).toHaveBeenCalled();
  });

  it('should initialize the server with specific tools correctly (category.update)', async () => {
    process.argv = [
      'node',
      'index.js',
      '--tools=category.update',
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
      configuration: {actions: {category: {update: true}}},
    });

    expect(StdioServerTransport).toHaveBeenCalled();
  });

  it('should initialize the server with specific tools correctly (product-selection.read)', async () => {
    process.argv = [
      'node',
      'index.js',
      '--tools=product-selection.read',
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
      configuration: {actions: {'product-selection': {read: true}}},
    });

    expect(StdioServerTransport).toHaveBeenCalled();
  });

  it('should initialize the server with specific tools correctly (product-selection.create)', async () => {
    process.argv = [
      'node',
      'index.js',
      '--tools=product-selection.create',
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
      configuration: {actions: {'product-selection': {create: true}}},
    });

    expect(StdioServerTransport).toHaveBeenCalled();
  });

  it('should initialize the server with specific tools correctly (product-selection.update)', async () => {
    process.argv = [
      'node',
      'index.js',
      '--tools=product-selection.update',
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
      configuration: {actions: {'product-selection': {update: true}}},
    });

    expect(StdioServerTransport).toHaveBeenCalled();
  });

  it('should initialize the server with specific tools correctly (order.read)', async () => {
    process.argv = [
      'node',
      'index.js',
      '--tools=order.read',
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
      configuration: {actions: {order: {read: true}}},
    });

    expect(StdioServerTransport).toHaveBeenCalled();
  });

  it('should initialize the server with specific tools correctly (order.create)', async () => {
    process.argv = [
      'node',
      'index.js',
      '--tools=order.create',
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
      configuration: {actions: {order: {create: true}}},
    });

    expect(StdioServerTransport).toHaveBeenCalled();
  });

  it('should initialize the server with specific tools correctly (order.update)', async () => {
    process.argv = [
      'node',
      'index.js',
      '--tools=order.update',
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
      configuration: {actions: {order: {update: true}}},
    });

    expect(StdioServerTransport).toHaveBeenCalled();
  });

  it('should initialize the server with cart.read tool correctly', async () => {
    process.argv = [
      'node',
      'index.js',
      '--tools=cart.read',
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
      configuration: {actions: {cart: {read: true}}},
    });

    expect(StdioServerTransport).toHaveBeenCalled();
  });

  it('should initialize the server with cart.create tool correctly', async () => {
    process.argv = [
      'node',
      'index.js',
      '--tools=cart.create',
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
      configuration: {actions: {cart: {create: true}}},
    });

    expect(StdioServerTransport).toHaveBeenCalled();
  });

  it('should initialize the server with cart.update tool correctly', async () => {
    process.argv = [
      'node',
      'index.js',
      '--tools=cart.update',
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
      configuration: {actions: {cart: {update: true}}},
    });

    expect(StdioServerTransport).toHaveBeenCalled();
  });
});
