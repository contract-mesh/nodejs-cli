async function validateFeature(feature, context) {
  let results = await context.validateSchema(feature, `${__dirname}/feature-schema.yaml`);
  return results;
}

async function validateDependency(dependency, context) {
  let results = await context.validateSchema(dependency, `${__dirname}/dependency-schema.yaml`);

  if (results.length === 0) {
    // validate results.
  }
  return results;
}

module.exports.features = {
  default: {
    validate: validateFeature
  }
}

module.exports.dependencies = {
  default: {
    validate: validateDependency
  }
}