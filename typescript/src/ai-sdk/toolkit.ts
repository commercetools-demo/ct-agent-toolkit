import CommercetoolsAPI from '../shared/api';
import tools from '../shared/tools';
import {isToolAllowed} from '../shared/configuration';
import type {Configuration} from '../types/configuration';
import type {
  Tool,
  LanguageModelV1StreamPart,
  Experimental_LanguageModelV1Middleware as LanguageModelV1Middleware,
} from 'ai';
import CommercetoolsTool from './tool';
import {getCustomerById} from '../shared/customer/functions';
import {customerAllowedTools} from '../shared/constants';
class CommercetoolsAgentToolkit {
  private _commercetools: CommercetoolsAPI;
  private _configuration: Configuration;
  private _projectKey: string;
  private _toolDefinitions: Map<string, Tool> = new Map();

  tools: {[key: string]: Tool};

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
    this.tools = {};

    const filteredTools = tools.filter((tool) =>
      isToolAllowed(tool, configuration)
    );

    filteredTools.forEach((tool) => {
      this._toolDefinitions.set(tool.method, {
        parameters: tool.parameters,
        description: tool.description,
        execute: async (arg: any) => {
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
    }
  }

  public authenticateAdmin() {
    if (this._configuration.context?.isAdmin) {
      // Implement admin authentication
      return this.registerAdminTools();
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

  private registerTool(name: string, tool: Tool) {
    this.tools[name] = tool;
  }

  private registerAdminTools() {
    for (const [name, tool] of this._toolDefinitions.entries()) {
      this.registerTool(name, tool);
    }
  }
  getTools(): {[key: string]: Tool} {
    return this.tools;
  }
}

export default CommercetoolsAgentToolkit;
