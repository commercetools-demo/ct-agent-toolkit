import {Configuration, Permission} from '../types/configuration';
import {AvailableNamespaces, Tool} from '../types/tools';

export const isToolAllowed = (
  tool: Tool,
  configuration: Configuration
): boolean => {
  return Object.keys(tool.actions).every((resource) => {
    // For each resource.permission pair, check the configuration.
    const permissions = tool.actions[resource];

    return Object.keys(permissions).every((permission) => {
      return (
        configuration?.actions?.[resource as AvailableNamespaces]?.[
          permission as Permission
        ] === true
      );
    });
  });
};
