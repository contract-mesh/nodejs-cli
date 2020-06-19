'use strict';
const fs = require('promise-fs');
const JsonSchemaValidator = require('jsonschema').Validator
const extensibility = require('./extensibility.js');
const yaml = require('yaml');
const Enumerable = require('linq');
const parsing = require('./parsing.js');
const catalog = require('./catalog.js');
const JsonPath = require('jsonpath');

function Context(projectPath, jsonPath = '$', obj = null, parent = null, category = 'project', type = null) {
  this.projectPath = projectPath;
  this.jsonPath = jsonPath;
  this.jsonPathComponents = Enumerable.from(JsonPath.parse(jsonPath)).select(c => c.expression.value).toArray();
  this.obj = obj;
  this.parent = parent;
  this.root = parent && parent.root ? parent.root : this;
  this.category = category;
  this.type = type;

  this.child = function(obj, relativePath, category, type) {
    let newPath = this.jsonPath + (relativePath[0] != '[' ? '.' : '') + relativePath;

    return new Context(this.projectPath, newPath, obj, this, category, type);
  }

  this.initProject = async function() {
    if (this.root && this.root != this) {
      await this.root.initProject();
    } else if (!this.obj) {
      try {
        await fs.access(this.projectPath);
      } catch (error) {
        throw `Project contract not found: ${this.projectPath}`;
      }

      this.obj = await parsing.parseProject(this.projectPath);
      this.project = this.obj;
      this.type = this.project.type;
    }
  };

  this.validate = async function() {
    let version = null;
    if (this.obj.contractmesh) {
      version = this.obj.contractmesh;
    }

    // base schema
    try {
      const schemaPath = `${__dirname}/builtin/base-schemas/${this.category}${version ? '.' + version : ''}.yaml`;

      const baseSchemaResults = await this.validateSchema(schemaPath);

      if (baseSchemaResults.length > 0) {
        return baseSchemaResults;
      }
    } catch {
      // base schema does not exist
    }

    let module;

    try {
      module = await extensibility.getExtension(this.type, this.category);
    } catch (error) {
      const moduleLoadingError = {
        errors: {}
      };

      moduleLoadingError.errors[this.jsonPath] = error;

      return moduleLoadingError;
    }

    return await module.validate(this);
  };

  this.validateSchema = async function(schemaPath) {
    const data = await fs.readFile(schemaPath, {encoding: 'utf-8'});
    const schema = yaml.parse(data);

    const validator = new JsonSchemaValidator();

    let validationResults = validator.validate(this.obj, schema);

    let result = Enumerable.from(validationResults.errors).select(e => {
      return {
        path: e.property.replace(/^(?:\$|instance)(?=\.|\[|$)/, this.jsonPath).replace('"', '\''),
        message: e.message
      }
    }).toArray();

    return result;
  }

  this.getProject = catalog.getProject;
}

module.exports = Context;