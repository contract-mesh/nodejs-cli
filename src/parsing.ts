import * as fs from 'promise-fs';
import * as yaml from 'yaml';
import * as docInheritance from './doc-inheritance';

export async function parseProject(projectPath: string) {
  const data = await fs.readFile(projectPath, {encoding: 'utf-8'});
  let project = yaml.parse(data);

  if (typeof(project.contractmesh) === 'undefined') {
    throw 'A contractmesh property with a version value is required, but missing from the project.'
  } else if (typeof(project.contractmesh) === 'number') {
    if (Number.isInteger(project.contractmesh)) {
      project.contractmesh = `${project.contractmesh}.0`;
    } else {
      project.contractmesh = new Number(project.contractmesh).toString();
    }
  } else if (typeof(project.contractmesh) === 'string') {
    if (!project.contractmesh.match(/^\d+(?:\.\d+)*$/)) {
      throw `The contractmesh property must provide a valid version number of the Contract Mesh document format. '${project.contractmesh}' is not a valid version number.`;
    }
  }

  const expandResult = await docInheritance.expand(project);

  if (expandResult.errors) {
    throw expandResult.errors;
  }

  project = expandResult.obj;

  return project;
}
