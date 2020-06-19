const fs = require('promise-fs');
const PluginManager = require('live-plugin-manager').PluginManager;

// const cwd = './.contractmesh';
// fs.exists(cwd, exists => {
//   if (!exists) {
//     fs.mkdir(cwd);
//   }
// });

const pluginManager = new PluginManager({cwd:'./.contractmesh',pluginsPath:'./node_modules'});

export async function getModule(ref: string, resourceType: string) {
  const shorthandRefResult = ref.match(/^\s*(?<module>[-\w]+)\s*$/);

  let moduleName;
  let resourceName;
  let found = false;

  if (shorthandRefResult) {
    resourceName = 'default'
    moduleName = `${__dirname}/builtin/${shorthandRefResult.groups.module}`;

    try {
      await fs.access(moduleName);
      found = true;
    } catch {
      moduleName = `contractmesh-${shorthandRefResult.groups.module}`
    }
  } else {
    const packageRefResult = ref.match(/^\s*(?<module>[-\w]+)\/(?<name>[-\w]+)\s*/);

    if (packageRefResult)
    {
      moduleName = packageRefResult.groups.module;
      resourceName = packageRefResult.groups.name;
    } else {
      throw `Invalid module reference ${ref}`;
    }
  }

  let module;

  if (found) {
    // built-in extension
    try {
      module = require(moduleName);
    } catch (error) {
      throw `Unable to find built-in extension referenced by ${ref}`;
    }
  } else {
    // packaged extension
    try {
      if (!pluginManager.alreadyInstalled(moduleName)) {
        let info = await pluginManager.install(moduleName);
      }
      module = pluginManager.require(moduleName);
    } catch (error) {
      throw `Unable to find npm extension referenced by ${ref}`;
    }
  }

  const resources = module[resourceType];
  if (!resources) {
    throw `Unable to find resource type ${resourceType} in module ${ref}`;
  }

  const resource = resources[resourceName];
  if (!resource) {
    throw `Unable to find resource '${resourceName}' of type ${resourceType} in module ${ref}`;
  }

  return resource;
}
