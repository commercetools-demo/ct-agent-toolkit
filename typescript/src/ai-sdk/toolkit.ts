import CommercetoolsAPI from '../shared/api';
import tools from '../shared/tools';
import {isToolAllowed} from '../shared/configuration';
import type {Configuration} from '../types/configuration';
import type {
  CoreTool,
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

  tools: {[key: string]: CoreTool};
  private _allTools: {[key: string]: CoreTool} = {};

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
    this._allTools = {};

    const filteredTools = tools.filter((tool) =>
      isToolAllowed(tool, configuration)
    );

    filteredTools.forEach((tool) => {
      this._allTools[tool.method] = CommercetoolsTool(
        this._commercetools,
        tool.method,
        tool.description,
        tool.parameters
      );
    });

    // By default, initialize with all tools
    this.tools = {...this._allTools};
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
    // Reset tools and only keep customer allowed ones
    this.tools = {};

    // Filter tools to only allow customer-specific ones
    customerAllowedTools.forEach((toolName) => {
      if (this._allTools[toolName]) {
        this.tools[toolName] = this._allTools[toolName];
      }
    });
  }

  private registerAdminTools() {
    for (const [name, tool] of Object.entries(this._allTools)) {
      this.tools[name] = tool;
    }
  }
  getTools(): {[key: string]: CoreTool} {
    return this.tools;
  }
}

export default CommercetoolsAgentToolkit;
