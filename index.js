'use strict';
const console = require('console');
const cli = require(`${__dirname}/src/cli.js`);

cli.run('root').catch(err => console.error(err));
