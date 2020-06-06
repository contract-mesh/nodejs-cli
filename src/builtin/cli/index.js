async function validate(obj, context) {
  return await context.validateSchema(obj, `${__dirname}/feature-schema.yaml`);
}

module.exports.features = {
  default: {
    validate: validate
  }
}