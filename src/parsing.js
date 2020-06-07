'use strict';
const fs = require('promise-fs');
const yaml = require('yaml')
const docInheritance = require('./doc-inheritance.js');

async function parseProject(projectPath) {
  const data = await fs.readFile(projectPath, {encoding: 'utf-8'});
  let project = yaml.parse(data);

  if (typeof(project.contractmesh) === 'undefined') {
    throw 'A contractmesh property with a version value is required, but missing from the project.'
  } else if (typeof(project.contractmesh) === 'number') {
    if (Number.isInteger(project.contractmesh)) {
      project.contractmesh = `${project.contractmesh}.0`;
    } else {
      project.contractmesh = Number.toString(project.contractmesh);
    }
  } else if (typeof(project.contractmesh) === 'string') {
    if (!project.contractmesh.match(/^\d+(?:\.\d+)*$/)) {
      throw `The contractmesh property must provide a valid version number of the Contract Mesh document format. '${project.contractmesh}' is not a valid version number.`;
    }
  }

  const expandResult = await docInheritance.expand(project);

  if (expandResult.errors) {
    throw expandResult.errors;
  }

  project = expandResult.obj;

  return project;
}

module.exports.parseProject = parseProject;