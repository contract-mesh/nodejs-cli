'use strict';
const console = require('console');
const cli = require('./src/cli.js');

cli.run('root').catch(err => console.error(err));
