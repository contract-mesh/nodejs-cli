async function validate(obj, context) {
  return await context.validateSchema(obj, `${__dirname}/feature-schema.yaml`, context);
}

module.exports.feature = {
  default: {
    validate: validate
  }
}