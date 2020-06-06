'use strict';
const fs = require('promise-fs');
const JsonSchemaValidator = require('jsonschema').Validator
const extensibility = require(`${__dirname}/extensibility.js`);
const yaml = require('yaml');
const Enumerable = require('linq');
const parsing = require(`${__dirname}/parsing.js`);
const catalog = require(`${__dirname}/catalog.js`);

function Context(projectPath, project, jsonPath = null) {
  this.projectPath = projectPath;
  this.jsonPath = jsonPath ? jsonPath : "$";
  this.project = project;

  this.initProject = async function() {
    if (!project) {
      try {
        await fs.access(this.projectPath);
      } catch (error) {
        throw `Project contract not found: ${this.projectPath}`;
      }

      this.project = await parsing.parseProject(this.projectPath);
    }
  };

  this.validateObject = async function(category, type, obj, jsonPath = null) {
    const context = jsonPath ? new Context(this.projectPath, this.project, jsonPath) : this;

    var version = null;
    if (obj.contractmesh) {
      version = obj.contractmesh;
    }

    // base schema
    try {
      const baseSchemaResults = await this.validateSchema(
        obj,
        `${__dirname}/builtin/base-schemas/${category}${version ? '.' + version : ''}.yaml`,
        context);

      if (baseSchemaResults.length > 0) {
        return baseSchemaResults;
      }
    } catch {
      // base schema does not exist
    }

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

  this.validateSchema = async function(obj, schemaPath) {
    const data = await fs.readFile(schemaPath, {encoding: 'utf-8'});
    const schema = yaml.parse(data);

    const validator = new JsonSchemaValidator();

    var validationResults = validator.validate(obj, schema);

    var result = Enumerable.from(validationResults.errors).select(e => {
      return {
        path: e.property.replace(/^(?:\$|instance)(?=\.|$)/, this.jsonPath),
        message: e.message
      }
    }).toArray();

    return result;
  }

  this.getProject = catalog.getProject;
}

module.exports = Context;