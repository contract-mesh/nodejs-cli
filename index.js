'use strict';
const fs = require('fs');
const neodoc = require('neodoc');
const validation = require('./src/validation.js');

const docoptPath = `${__dirname}/features/cli.docopt`;

fs.readFile(docoptPath, {encoding: 'utf-8'}, function(err,data) {
    if (!err) {
        const args = neodoc.run(data, { optionsFirst: true, smartOptions: true });

        if (args['validate']) {
            validation.validate().catch(function(error) {
                console.log(error);
            });
        }
    }
});
