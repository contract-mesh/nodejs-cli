'use strict';
const console = require('console');
const cli = require(`${__dirname}/../cli.js`);

require('colors');

module.exports.run = async function(args, context) {
  if (!context.project.type) {
    throw `project does not have a type property`;
  }

  var results;

  try {
    results = await context.validateObject('projects', context.project.type, context.project);
  } catch (error) {
    cli.outputObject(error, args);
  }

  if (results.length > 0) {
    cli.outputObject(results, args);
  } else {
    console.log('Success!'.green + ' The project is valid.');
  }
};