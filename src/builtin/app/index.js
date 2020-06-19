async function validate(context) {
  let results = await context.validateSchema(`${__dirname}/project-schema.yaml`);

  if (results.length === 0) {
    // features
    if (context.obj.features) {
      const featureKeys = Object.keys(context.obj.features);

      for (let i = 0; i < featureKeys.length; i++) {
        const featureKey = featureKeys[i];

        const featureContext = context.child(context.obj.features[featureKey], `features['${featureKey}']`, 'feature', featureKey);

        const featureResults = await featureContext.validate();

        results = results.concat(featureResults);
      }
    }

    // dependencies
    if (context.obj.dependencies) {
      const projectNames = Object.keys(context.obj.dependencies);

      for (let i = 0; i < projectNames.length; i++) {
        const projectName = projectNames[i];
        const dependencyProject = await context.getProject(projectName);

        if (dependencyProject == null) {
          results = results.concat([
            {
              path: `${context.jsonPath}.dependencies['${projectName}']`,
              message: 'Project not found'
            }
          ]);
        } else {
          const dependencies = context.obj.dependencies[projectName];

          const dependencyNames = Object.keys(dependencies);

          for (let j = 0; j < dependencyNames.length; j++) {
            const dependencyName = dependencyNames[j];
            const dependency = dependencies[dependencyName];
            const dependencyContext = context.child(dependency, `dependencies['${projectName}']['${dependencyName}']`, 'dependency', dependencyName);

            const featureResults = await dependencyContext.validate();

            results = results.concat(featureResults);
          }
        }
      }
    }
  }

  return results;
}

module.exports.project = {
  default: {
    validate: validate,
    hello: 'world'
  }
}