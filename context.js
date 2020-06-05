const fs = require('promise-fs');
const JsonSchemaValidator = require('jsonschema').Validator
const extensibility = require('./extensibility');
const yaml = require('yaml');
const Enumerable = require('linq');

function Context(jsonPath = null) {
  this.jsonPath = jsonPath ? jsonPath : "$";

  this.validateObject = async function(category, type, obj, jsonPath = null) {
    const context = jsonPath ? new Context(jsonPath) : this;
    var module;

    try {
      module = await extensibility.getExtension(type, category);
    } catch (error) {
      const moduleLoadingError = {
        errors: {}
      };

      moduleLoadingError.errors[context.jsonPath] = error;

      return moduleLoadingError;
    }
    return await module.validate(obj, context);
  };

  this.validateSchema = async function(obj, schemaPath, context) {
    const data = await fs.readFile(schemaPath, {encoding: 'utf-8'})
    const schema = yaml.parse(data);

    const validator = new JsonSchemaValidator();

    var validationResults = validator.validate(obj, schema);

    var result = Enumerable.from(validationResults.errors).select(e => {
      return {
        path: e.property.replace(/^(?:\$|instance)(?=\.)/, context.jsonPath),
        message: e.message
      }
    }).toArray();

    return result;
  }
}

module.exports = Context;