'use strict';
const cli = require(`${__dirname}/../cli.js`);

module.exports.run = async function(args, context) {
  cli.outputObject(context.project, args);
};