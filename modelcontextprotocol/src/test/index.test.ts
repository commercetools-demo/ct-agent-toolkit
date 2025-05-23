import {parseArgs} from '../index';

describe('parseArgs function', () => {
  describe('success cases', () => {
    it('should parse all arguments correctly', () => {
      const args = [
        '--tools=all',
        '--clientId=test_client_id',
        '--clientSecret=test_client_secret',
        '--authUrl=https://auth.commercetools.com',
        '--projectKey=test_project',
        '--apiUrl=https://api.commercetools.com',
      ];
      const {options, env} = parseArgs(args);
      expect(options.tools).toEqual(['all']);
      expect(env.clientId).toBe('test_client_id');
      expect(env.clientSecret).toBe('test_client_secret');
      expect(env.authUrl).toBe('https://auth.commercetools.com');
      expect(env.projectKey).toBe('test_project');
      expect(env.apiUrl).toBe('https://api.commercetools.com');
    });

    it('should parse tools argument correctly', () => {
      const args = [
        '--tools=products.read',
        '--clientId=test_client_id',
        '--clientSecret=test_client_secret',
        '--authUrl=https://auth.commercetools.com',
        '--projectKey=test_project',
        '--apiUrl=https://api.commercetools.com',
      ];
      const {options} = parseArgs(args);
      expect(options.tools).toEqual(['products.read']);
    });

    it('should use environment variables when arguments are not provided', () => {
      process.env.CLIENT_ID = 'env_client_id';
      process.env.CLIENT_SECRET = 'env_client_secret';
      process.env.AUTH_URL = 'https://auth.commercetools.com';
      process.env.PROJECT_KEY = 'env_project';
      process.env.API_URL = 'https://api.commercetools.com';

      const args = ['--tools=all'];
      const {env} = parseArgs(args);
      expect(env.clientId).toBe('env_client_id');
      expect(env.clientSecret).toBe('env_client_secret');
      expect(env.authUrl).toBe('https://auth.commercetools.com');
      expect(env.projectKey).toBe('env_project');
      expect(env.apiUrl).toBe('https://api.commercetools.com');

      // Clean up
      delete process.env.CLIENT_ID;
      delete process.env.CLIENT_SECRET;
      delete process.env.AUTH_URL;
      delete process.env.PROJECT_KEY;
      delete process.env.API_URL;
    });

    it('should prefer command line arguments over environment variables', () => {
      process.env.CLIENT_ID = 'env_client_id';
      process.env.CLIENT_SECRET = 'env_client_secret';
      process.env.AUTH_URL = 'https://auth.commercetools.com';
      process.env.PROJECT_KEY = 'env_project';
      process.env.API_URL = 'https://api.commercetools.com';

      const args = [
        '--tools=all',
        '--clientId=arg_client_id',
        '--clientSecret=arg_client_secret',
        '--authUrl=https://auth-arg.commercetools.com',
        '--projectKey=arg_project',
        '--apiUrl=https://api-arg.commercetools.com',
      ];
      const {env} = parseArgs(args);
      expect(env.clientId).toBe('arg_client_id');
      expect(env.clientSecret).toBe('arg_client_secret');
      expect(env.authUrl).toBe('https://auth-arg.commercetools.com');
      expect(env.projectKey).toBe('arg_project');
      expect(env.apiUrl).toBe('https://api-arg.commercetools.com');

      // Clean up
      delete process.env.CLIENT_ID;
      delete process.env.CLIENT_SECRET;
      delete process.env.AUTH_URL;
      delete process.env.PROJECT_KEY;
      delete process.env.API_URL;
    });
  });

  describe('error cases', () => {
    it('should throw an error if tools argument is not provided', () => {
      const args = [
        '--clientId=test_client_id',
        '--clientSecret=test_client_secret',
        '--authUrl=https://auth.commercetools.com',
        '--projectKey=test_project',
        '--apiUrl=https://api.commercetools.com',
      ];
      expect(() => parseArgs(args)).toThrow(
        'The --tools arguments must be provided.'
      );
    });

    it('should throw an error if an invalid tool is provided', () => {
      const args = [
        '--tools=invalid.tool',
        '--clientId=test_client_id',
        '--clientSecret=test_client_secret',
        '--authUrl=https://auth.commercetools.com',
        '--projectKey=test_project',
        '--apiUrl=https://api.commercetools.com',
      ];
      expect(() => parseArgs(args)).toThrow(
        'Invalid tool: invalid.tool. Accepted tools are: products.read, products.create, products.update, project.read, product-search.read, category.read, category.create, category.update, product-selection.read, product-selection.create, product-selection.update'
      );
    });

    it('should throw an error if required credentials are missing', () => {
      const args = ['--tools=all'];
      expect(() => parseArgs(args)).toThrow(
        'Commercetools credentials missing. Please provide all required credentials either via arguments or environment variables (CLIENT_ID, CLIENT_SECRET, AUTH_URL, PROJECT_KEY, API_URL).'
      );
    });

    it('should throw an error if an invalid argument is provided', () => {
      const args = [
        '--invalid-arg=value',
        '--tools=all',
        '--clientId=test_client_id',
        '--clientSecret=test_client_secret',
        '--authUrl=https://auth.commercetools.com',
        '--projectKey=test_project',
        '--apiUrl=https://api.commercetools.com',
      ];
      expect(() => parseArgs(args)).toThrow(
        'Invalid argument: invalid-arg. Accepted arguments are: tools, clientId, clientSecret, authUrl, projectKey, apiUrl'
      );
    });
  });
});
