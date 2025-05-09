import {McpServer} from '@modelcontextprotocol/sdk/server/mcp.js';
import {isToolAllowed} from '../shared/configuration';
import type {Configuration} from '../types/configuration';
import CommercetoolsAPI from '../shared/api';
import tools from '../shared/tools';
import {getCustomerById} from '../shared/customer/functions';
import {customerAllowedTools, anonymousAllowedTools} from '../shared/constants';
class CommercetoolsAgentToolkit extends McpServer {
  private _commercetools: CommercetoolsAPI;
  private _toolDefinitions: Map<string, any> = new Map();
  private _configuration: Configuration;
  private _projectKey: string;
  constructor({
    clientId,
    clientSecret,
    authUrl,
    projectKey,
    apiUrl,
    configuration,
  }: {
    clientId: string;
    clientSecret: string;
    authUrl: string;
    projectKey: string;
    apiUrl: string;
    configuration: Configuration;
  }) {
    super({
      name: 'Commercetools',
      version: '0.4.0',
    });

    this._commercetools = new CommercetoolsAPI(
      clientId,
      clientSecret,
      authUrl,
      projectKey,
      apiUrl,
      configuration.context
    );
    this._configuration = configuration;
    this._projectKey = projectKey;
    const filteredTools = tools.filter((tool) =>
      isToolAllowed(tool, configuration)
    );
    filteredTools.forEach((tool) => {
      this._toolDefinitions.set(tool.method, {
        method: tool.method,
        description: tool.description,
        paramSchema: tool.parameters.shape,
        handler: async (arg: any) => {
          const result = await this._commercetools.run(tool.method, arg);
          return {
            content: [
              {
                type: 'text' as const,
                text: String(result),
              },
            ],
          };
        },
      });
    });
  }

  public authenticateCustomer() {
    try {
      if (this._configuration.context?.customerId) {
        return getCustomerById(
          this._commercetools.apiRoot,
          {projectKey: this._projectKey},
          {id: this._configuration.context?.customerId}
        ).then((customer) => {
          if (customer) {
            this.enableCustomerTools();
          } else {
            throw new Error('Customer not found');
          }
        });
      } else {
        throw new Error('No customer ID found');
      }
    } catch (error) {
      this.enableAnonymousTools();
    }
  }

  public authenticateAdmin() {
    if (this._configuration.context?.isAdmin) {
      // Implement admin authentication
      return this.registerAdminTools();
    }
  }

  private registerTool(
    name: string,
    config: {
      description: string;
      paramSchema: any;
      handler: (arg: any) => Promise<any>;
    }
  ) {
    this.tool(name, config.description, config.paramSchema, config.handler);
  }

  private registerAdminTools() {
    for (const [name, config] of this._toolDefinitions.entries()) {
      this.registerTool(name, config);
    }
  }

  private enableCustomerTools() {
    customerAllowedTools.forEach((toolName) => {
      const toolConfig = this._toolDefinitions.get(toolName);
      if (toolConfig) {
        this.registerTool(toolName, toolConfig);
      }
    });
  }

  private enableAnonymousTools() {
    anonymousAllowedTools.forEach((toolName) => {
      const toolConfig = this._toolDefinitions.get(toolName);
      if (toolConfig) {
        this.registerTool(toolName, toolConfig);
      }
    });
  }
}

export default CommercetoolsAgentToolkit;
