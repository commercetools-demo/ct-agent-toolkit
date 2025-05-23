import CommercetoolsAPI from '../shared/api';
import tools from '../shared/tools';
import {isToolAllowed} from '../shared/configuration';
import type {Configuration} from '../types/configuration';
import type {CoreTool} from 'ai';
import CommercetoolsTool from './tool';

class CommercetoolsAgentToolkit {
  private _commercetools: CommercetoolsAPI;

  tools: {[key: string]: CoreTool};

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
      apiUrl
    );
    this.tools = {};

    const filteredTools = tools.filter((tool) =>
      isToolAllowed(tool, configuration)
    );

    filteredTools.forEach((tool) => {
      this.tools[tool.method] = CommercetoolsTool(
        this._commercetools,
        tool.method,
        tool.description,
        tool.parameters
      );
    });
  }

  getTools(): {[key: string]: CoreTool} {
    return this.tools;
  }
}

export default CommercetoolsAgentToolkit;
