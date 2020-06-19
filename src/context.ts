const fs = require('promise-fs');
const JsonSchemaValidator = require('jsonschema').Validator
import * as extensibility from './extensibility';
import * as yaml from 'yaml';
import * as Enumerable from 'linq';
import * as parsing from './parsing';
import * as catalog from './catalog';
import * as JsonPath from 'jsonpath';

/**
 * The execution context of the current document processing operation.
 */
export class ContractContext {
  /**
   * 
   */
  public jsonPathComponents: string[];
  /**
   * The root context in the context tree.
   */
  public root: ContractContext;
  public project: any;

  public readonly getProject = catalog.getProject;

  constructor(
    /**
     * The local path of the current project.yaml file.
     */
    public projectPath: string,
    /**
     * The JSON path of the current document element.
     */
    public jsonPath: string = '$',
    /**
     * The parsed object of the current document element.
     */
    public element: any = null,
    /**
     * The context that represents the parent document element.
     */
    public parent: ContractContext = null,
    /**
     * The category of the document element.
     */
    public category: string = 'project',
    /**
     * The type of the document element.
     */
    public type: string = null
  )
  {
    this.jsonPathComponents = Enumerable.from(JsonPath.parse(jsonPath)).select((c: any) => c.expression.value).toArray();
    this.root = parent && parent.root ? parent.root : this;
  }

  public child(obj: any, relativePath: string, category: string, type: string): ContractContext {
    let newPath = this.jsonPath + (relativePath[0] != '[' ? '.' : '') + relativePath;

    return new ContractContext(this.projectPath, newPath, obj, this, category, type);
  }

  public async initProject() {
    if (this.root && this.root != this) {
      await this.root.initProject();
    } else if (!this.element) {
      try {
        await fs.access(this.projectPath);
      } catch (error) {
        throw `Project contract not found: ${this.projectPath}`;
      }

      this.element = await parsing.parseProject(this.projectPath);
      this.project = this.element;
      this.type = this.project.type;
    }
  }

  public async validate(): Promise<any> {
    let version = null;
    if (this.element.contractmesh) {
      version = this.element.contractmesh;
    }

    // base schema
    try {
      const schemaPath = `${__dirname}/builtin/base-schemas/${this.category}${version ? '.' + version : ''}.yaml`;

      const baseSchemaResults = await this.validateSchema(schemaPath);

      if (baseSchemaResults.length > 0) {
        return baseSchemaResults;
      }
    } catch {
      // base schema does not exist
    }

    let module;

    try {
      module = await extensibility.getModule(this.type, this.category);
    } catch (error) {
      const moduleLoadingError = {
        errors: {}
      };

      moduleLoadingError.errors[this.jsonPath] = error;

      return moduleLoadingError;
    }

    return await module.validate(this);
  }

  public async validateSchema(schemaPath): Promise<any> {
    const data = await fs.readFile(schemaPath, {encoding: 'utf-8'});
    const schema = yaml.parse(data);

    const validator = new JsonSchemaValidator();

    let validationResults = validator.validate(this.element, schema);

    let result = Enumerable.from(validationResults.errors).select((e: any) => {
      return {
        path: e.property.replace(/^(?:\$|instance)(?=\.|\[|$)/, this.jsonPath).replace('"', '\''),
        message: e.message
      }
    }).toArray();

    return result;
  }
}
