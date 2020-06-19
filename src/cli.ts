import * as fs from 'promise-fs';
import * as neodoc from 'neodoc';
import { ContractContext } from './context';
import * as console from 'console';
import { highlight } from 'cli-highlight';

export async function run(commandName: string, context: ContractContext = null, argv: any = null) {
  // Parse args
  const docoptPath = `${__dirname}/../contracts/${commandName}.docopt`;
  const spec = await fs.readFile(docoptPath, {encoding: 'utf-8'});
  const args = neodoc.run(spec, {argv: argv, optionsFirst: spec.match(/\<command\>/g) != null, smartOptions: true});

  // context
  if (!context) {
    context = new ContractContext('./project.yaml');
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

export function outputObject(obj, args) {
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
