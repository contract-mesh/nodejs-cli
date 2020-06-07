'use strict';
const cli = require('./../cli.js');

module.exports.run = async function(args, context) {
  cli.outputObject(context.project, args);
};