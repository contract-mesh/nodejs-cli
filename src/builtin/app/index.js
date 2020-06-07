async function validate(project, context) {
  let results = await context.validateSchema(project, `${__dirname}/project-schema.yaml`);

  if (results.length === 0) {
    // features
    if (project.features) {
      const featureKeys = Object.keys(project.features);

      for (let i = 0; i < featureKeys.length; i++) {
        const featureKey = featureKeys[i];

        const featureResults = await context.validateObject(
          'features',
          featureKey,
          project.features[featureKey],
          `$.features.['${featureKey}']`);

        results = results.concat(featureResults);
      }
    }

    // dependencies
    if (project.dependencies) {
      const projectNames = Object.keys(project.dependencies);

      for (let i = 0; i < projectNames.length; i++) {
        const projectName = projectNames[i];
        const dependencyProject = await context.getProject(projectName);

        if (dependencyProject == null) {
          results = results.concat([
            {
              path: `$.dependencies.['${projectName}']`,
              message: 'Project not found'
            }
          ]);
        } else {
          const featureDependencies = project.dependencies[projectName];

          const featureNames = Object.keys(featureDependencies);

          for (let j = 0; j < featureNames.length; j++) {
            const featureName = featureNames[j];
            const featureDependency = featureDependencies[featureName];

            const featureResults = await context.validateObject('dependencies', featureName, featureDependency, `$.dependencies.['${projectName}'].['${featureName}']`);

            results = results.concat(featureResults);
          }
        }
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