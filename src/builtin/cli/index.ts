import { ContractContext } from "../../context";

async function validate(context: ContractContext) {
  return await context.validateSchema(`${__dirname}/feature-schema.yaml`);
}

export default {
  feature: {
    default: {
      validate: validate
    }
  }
}