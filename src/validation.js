const fs = require('promise-fs');
const yaml = require('yaml')
const docInheritance = require('./doc-inheritance.js');
const Context = require('./context.js');

async function validate() {
  const projectPath = './project.yaml';
  const data = await fs.readFile(projectPath, {encoding: 'utf-8'});
  var project = yaml.parse(data);

  const expandResult = await docInheritance.expand(project);

  if (expandResult.errors) {
    throw expandResult.errors;
  }

  project = expandResult.obj;

  if (!project.type) {
    throw `./project.yaml does not have a type property`;
  }

  const context = new Context();

  const validationResult = await context.validateObject('project', project.type, project);

  if (validationResult.length > 0) {
    throw validationResult;
  }
}

module.exports.validate = validate