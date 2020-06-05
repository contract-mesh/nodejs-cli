async function validate(project, context) {
  var results = await context.validateSchema(project, `${__dirname}/project-schema.yaml`);

  if (results.length === 0) {
    // features
    if (project.features) {
      const featureKeys = Object.keys(project.features);

      for (var i = 0; i < featureKeys.length; i++) {
        const featureKey = featureKeys[i];

        const featureResults = await context.validateObject('features', featureKey, project.features[featureKey], `$.features.['${featureKey}']`);

        results = results.concat(featureResults);
      }
    }

    // dependencies
    if (project.dependencies) {
      const dependencyKeys = Object.keys(project.dependencies);

      for (var i = 0; i < dependencyKeys.length; i++) {
        const dependencyKey = dependencyKeys[i];

        const dependencyResults = await context.validateObject('dependency', dependencyKey, project.dependencies[dependencyKey], `$.dependencies.['${dependencyKey}']`);

        results = results.concat(dependencyResults);
      }
    }
  }

  return results;
}

module.exports.projects = {
  default: {
    validate: validate
  }
}