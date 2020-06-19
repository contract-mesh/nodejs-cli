import { ContractContext } from "../../context";

async function validateFeature(context: ContractContext) {
  let results = await context.validateSchema(`${__dirname}/feature-schema.yaml`);
  return results;
}

async function validateDependency(context: ContractContext) {
  let results = await context.validateSchema(`${__dirname}/dependency-schema.yaml`);

  if (results.length === 0) {
    // validate results.
    const projectName = context.jsonPathComponents.slice(-2)[0];
    const project = await context.getProject(projectName);

    if (!project.features.openapi) {
      results = results.concat([
        {
          path: context.jsonPath,
          message: `openapi feature not found in ${projectName}`
        }
      ]);
    } else {
      // const sourceKeys = Object.keys(project.features.openapi);

      // for (let i = 0; i < sourceKeys.length; i++) {
      //   const sourceSpec = project.features.openapi[sourceKeys[i]];
      // }
    }
  }
  return results;
}

export default {
  feature: {
    default: {
      validate: validateFeature
    }
  },
  dependency: {
    default: {
      validate: validateDependency
    }
  }
}
