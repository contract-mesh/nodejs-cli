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
function validate(context) {
    return __awaiter(this, void 0, void 0, function () {
        var results, featureKeys, i, featureKey, featureContext, featureResults, projectNames, i, projectName, dependencyProject, dependencies, dependencyNames, j, dependencyName, dependency, dependencyContext, featureResults;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, context.validateSchema(__dirname + "/project-schema.yaml")];
                case 1:
                    results = _a.sent();
                    if (!(results.length === 0)) return [3 /*break*/, 13];
                    if (!context.obj.features) return [3 /*break*/, 5];
                    featureKeys = Object.keys(context.obj.features);
                    i = 0;
                    _a.label = 2;
                case 2:
                    if (!(i < featureKeys.length)) return [3 /*break*/, 5];
                    featureKey = featureKeys[i];
                    featureContext = context.child(context.obj.features[featureKey], "features['" + featureKey + "']", 'feature', featureKey);
                    return [4 /*yield*/, featureContext.validate()];
                case 3:
                    featureResults = _a.sent();
                    results = results.concat(featureResults);
                    _a.label = 4;
                case 4:
                    i++;
                    return [3 /*break*/, 2];
                case 5:
                    if (!context.obj.dependencies) return [3 /*break*/, 13];
                    projectNames = Object.keys(context.obj.dependencies);
                    i = 0;
                    _a.label = 6;
                case 6:
                    if (!(i < projectNames.length)) return [3 /*break*/, 13];
                    projectName = projectNames[i];
                    return [4 /*yield*/, context.getProject(projectName)];
                case 7:
                    dependencyProject = _a.sent();
                    if (!(dependencyProject == null)) return [3 /*break*/, 8];
                    results = results.concat([
                        {
                            path: context.jsonPath + ".dependencies['" + projectName + "']",
                            message: 'Project not found'
                        }
                    ]);
                    return [3 /*break*/, 12];
                case 8:
                    dependencies = context.obj.dependencies[projectName];
                    dependencyNames = Object.keys(dependencies);
                    j = 0;
                    _a.label = 9;
                case 9:
                    if (!(j < dependencyNames.length)) return [3 /*break*/, 12];
                    dependencyName = dependencyNames[j];
                    dependency = dependencies[dependencyName];
                    dependencyContext = context.child(dependency, "dependencies['" + projectName + "']['" + dependencyName + "']", 'dependency', dependencyName);
                    return [4 /*yield*/, dependencyContext.validate()];
                case 10:
                    featureResults = _a.sent();
                    results = results.concat(featureResults);
                    _a.label = 11;
                case 11:
                    j++;
                    return [3 /*break*/, 9];
                case 12:
                    i++;
                    return [3 /*break*/, 6];
                case 13: return [2 /*return*/, results];
            }
        });
    });
}
exports.default = {
    project: {
        default: {
            validate: validate
        }
    }
};
//# sourceMappingURL=index.js.map