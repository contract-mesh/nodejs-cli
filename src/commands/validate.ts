import 'colors';
import * as cli from './../cli';
import { ContractContext } from '../context';

export async function run(args, context: ContractContext) {
  if (!context.project.type) {
    throw `project does not have a type property`;
  }

  let results;

  try {
    results = await context.validate();
  } catch (error) {
    cli.outputObject(error, args);
  }

  if (results.length > 0) {
    cli.outputObject(results, args);
  } else {
    console.log('Success!'.green + ' The project is valid.');
  }
};