'use strict';
const fs = require('promise-fs');
const yaml = require('yaml')
const docInheritance = require('./doc-inheritance.js');

async function parseProject(projectPath) {
  const data = await fs.readFile(projectPath, {encoding: 'utf-8'});
  var project = yaml.parse(data);

  const expandResult = await docInheritance.expand(project);

  if (expandResult.errors) {
    throw expandResult.errors;
  }

  project = expandResult.obj;

  return project;
}

module.exports.parseProject = parseProject;