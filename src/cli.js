'use strict';
const fs = require('promise-fs');
const neodoc = require('neodoc');
const Context = require('./context.js');
const console = require('console');
const highlight = require('cli-highlight').highlight;

async function run(commandName, context = null, argv = null) {
  // Parse args
  const docoptPath = `${__dirname}/../contracts/${commandName}.docopt`;
  const spec = await fs.readFile(docoptPath, {encoding: 'utf-8'});
  const args = neodoc.run(spec, {argv: argv, optionsFirst: spec.match(/\<command\>/g) != null, smartOptions: true});

  // context
  if (!context) {
    context = new Context('./project.yaml');
  }

  await context.initProject();

  // execute
  if (args['<command>']) {
    // sub-command specified
    const subCommandName = args['<command>'];
    const fullSubCommandName = commandName == 'root' ? subCommandName : `${commandName}-${subCommandName}`;

    await run(fullSubCommandName, context, [subCommandName].concat(args['<args>']));
  } else {
    // execute command
    const commandScriptPath = `${__dirname}/commands/${commandName}.js`;

    let commandScriptFound = true;

    try {
      await fs.access(commandScriptPath);
    } catch {
      // no logic exists for this command
      commandScriptFound = false;
    }

    if (commandScriptFound) {
      const commandScript = require(commandScriptPath);

      if (commandScript.run) {
        await commandScript.run(args, context);

        return;
      }
    }

    console.log(spec);
  }
}

function outputObject(obj, args) {
  let format = args['-f'];
  if (!format) {
    format = 'yaml';
  }

  let text;

  switch (format) {
    case 'json':
      text = JSON.stringify(obj, null, 2);
      break;
    default:
      const yaml = require('yaml');
      text = yaml.stringify(obj);
      break;
  }

  console.log(highlight(text, {language: format}));
}

module.exports.run = run;
module.exports.outputObject = outputObject;