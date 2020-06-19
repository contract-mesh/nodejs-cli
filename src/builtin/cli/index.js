async function validate(context) {
  return await context.validateSchema(`${__dirname}/feature-schema.yaml`);
}

module.exports.feature = {
  default: {
    validate: validate
  }
}