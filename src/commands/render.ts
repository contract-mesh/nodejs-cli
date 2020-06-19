import * as cli from './../cli';

export async function run(args, context) {
  cli.outputObject(context.project, args);
};