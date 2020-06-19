"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Context = void 0;
var fs = require('promise-fs');
var JsonSchemaValidator = require('jsonschema').Validator;
var extensibility = require("./extensibility");
var yaml = require("yaml");
var Enumerable = require("linq");
var parsing = require("./parsing");
var catalog = require("./catalog");
var JsonPath = require("jsonpath");
var Context = /** @class */ (function () {
    function Context(projectPath, jsonPath, obj, parent, category, type) {
        if (jsonPath === void 0) { jsonPath = '$'; }
        if (obj === void 0) { obj = null; }
        if (parent === void 0) { parent = null; }
        if (category === void 0) { category = 'project'; }
        if (type === void 0) { type = null; }
        this.projectPath = projectPath;
        this.jsonPath = jsonPath;
        this.obj = obj;
        this.parent = parent;
        this.category = category;
        this.type = type;
        this.getProject = catalog.getProject;
        this.jsonPathComponents = Enumerable.from(JsonPath.parse(jsonPath)).select(function (c) { return c.expression.value; }).toArray();
        this.root = parent && parent.root ? parent.root : this;
    }
    Context.prototype.child = function (obj, relativePath, category, type) {
        var newPath = this.jsonPath + (relativePath[0] != '[' ? '.' : '') + relativePath;
        return new Context(this.projectPath, newPath, obj, this, category, type);
    };
    Context.prototype.initProject = function () {
        return __awaiter(this, void 0, void 0, function () {
            var error_1, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!(this.root && this.root != this)) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.root.initProject()];
                    case 1:
                        _b.sent();
                        return [3 /*break*/, 8];
                    case 2:
                        if (!!this.obj) return [3 /*break*/, 8];
                        _b.label = 3;
                    case 3:
                        _b.trys.push([3, 5, , 6]);
                        return [4 /*yield*/, fs.access(this.projectPath)];
                    case 4:
                        _b.sent();
                        return [3 /*break*/, 6];
                    case 5:
                        error_1 = _b.sent();
                        throw "Project contract not found: " + this.projectPath;
                    case 6:
                        _a = this;
                        return [4 /*yield*/, parsing.parseProject(this.projectPath)];
                    case 7:
                        _a.obj = _b.sent();
                        this.project = this.obj;
                        this.type = this.project.type;
                        _b.label = 8;
                    case 8: return [2 /*return*/];
                }
            });
        });
    };
    Context.prototype.validate = function () {
        return __awaiter(this, void 0, void 0, function () {
            var version, schemaPath, baseSchemaResults, _a, module, error_2, moduleLoadingError;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        version = null;
                        if (this.obj.contractmesh) {
                            version = this.obj.contractmesh;
                        }
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 3, , 4]);
                        schemaPath = __dirname + "/builtin/base-schemas/" + this.category + (version ? '.' + version : '') + ".yaml";
                        return [4 /*yield*/, this.validateSchema(schemaPath)];
                    case 2:
                        baseSchemaResults = _b.sent();
                        if (baseSchemaResults.length > 0) {
                            return [2 /*return*/, baseSchemaResults];
                        }
                        return [3 /*break*/, 4];
                    case 3:
                        _a = _b.sent();
                        return [3 /*break*/, 4];
                    case 4:
                        _b.trys.push([4, 6, , 7]);
                        return [4 /*yield*/, extensibility.getModule(this.type, this.category)];
                    case 5:
                        module = _b.sent();
                        return [3 /*break*/, 7];
                    case 6:
                        error_2 = _b.sent();
                        moduleLoadingError = {
                            errors: {}
                        };
                        moduleLoadingError.errors[this.jsonPath] = error_2;
                        return [2 /*return*/, moduleLoadingError];
                    case 7: return [4 /*yield*/, module.validate(this)];
                    case 8: return [2 /*return*/, _b.sent()];
                }
            });
        });
    };
    Context.prototype.validateSchema = function (schemaPath) {
        return __awaiter(this, void 0, void 0, function () {
            var data, schema, validator, validationResults, result;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, fs.readFile(schemaPath, { encoding: 'utf-8' })];
                    case 1:
                        data = _a.sent();
                        schema = yaml.parse(data);
                        validator = new JsonSchemaValidator();
                        validationResults = validator.validate(this.obj, schema);
                        result = Enumerable.from(validationResults.errors).select(function (e) {
                            return {
                                path: e.property.replace(/^(?:\$|instance)(?=\.|\[|$)/, _this.jsonPath).replace('"', '\''),
                                message: e.message
                            };
                        }).toArray();
                        return [2 /*return*/, result];
                }
            });
        });
    };
    return Context;
}());
exports.Context = Context;
//# sourceMappingURL=context.js.map