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
exports.getModule = void 0;
var fs = require('promise-fs');
var PluginManager = require('live-plugin-manager').PluginManager;
// const cwd = './.contractmesh';
// fs.exists(cwd, exists => {
//   if (!exists) {
//     fs.mkdir(cwd);
//   }
// });
var pluginManager = new PluginManager({ cwd: './.contractmesh', pluginsPath: './node_modules' });
function getModule(ref, resourceType) {
    return __awaiter(this, void 0, void 0, function () {
        var shorthandRefResult, moduleName, resourceName, found, _a, packageRefResult, module, info, error_1, resources, resource;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    shorthandRefResult = ref.match(/^\s*(?<module>[-\w]+)\s*$/);
                    found = false;
                    if (!shorthandRefResult) return [3 /*break*/, 5];
                    resourceName = 'default';
                    moduleName = __dirname + "/builtin/" + shorthandRefResult.groups.module;
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, fs.access(moduleName)];
                case 2:
                    _b.sent();
                    found = true;
                    return [3 /*break*/, 4];
                case 3:
                    _a = _b.sent();
                    moduleName = "contractmesh-" + shorthandRefResult.groups.module;
                    return [3 /*break*/, 4];
                case 4: return [3 /*break*/, 6];
                case 5:
                    packageRefResult = ref.match(/^\s*(?<module>[-\w]+)\/(?<name>[-\w]+)\s*/);
                    if (packageRefResult) {
                        moduleName = packageRefResult.groups.module;
                        resourceName = packageRefResult.groups.name;
                    }
                    else {
                        throw "Invalid module reference " + ref;
                    }
                    _b.label = 6;
                case 6:
                    if (!found) return [3 /*break*/, 7];
                    // built-in extension
                    try {
                        module = require(moduleName);
                    }
                    catch (error) {
                        throw "Unable to find built-in extension referenced by " + ref;
                    }
                    return [3 /*break*/, 11];
                case 7:
                    _b.trys.push([7, 10, , 11]);
                    if (!!pluginManager.alreadyInstalled(moduleName)) return [3 /*break*/, 9];
                    return [4 /*yield*/, pluginManager.install(moduleName)];
                case 8:
                    info = _b.sent();
                    _b.label = 9;
                case 9:
                    module = pluginManager.require(moduleName);
                    return [3 /*break*/, 11];
                case 10:
                    error_1 = _b.sent();
                    throw "Unable to find npm extension referenced by " + ref;
                case 11:
                    resources = module[resourceType];
                    if (!resources) {
                        throw "Unable to find resource type " + resourceType + " in module " + ref;
                    }
                    resource = resources[resourceName];
                    if (!resource) {
                        throw "Unable to find resource '" + resourceName + "' of type " + resourceType + " in module " + ref;
                    }
                    return [2 /*return*/, resource];
            }
        });
    });
}
exports.getModule = getModule;
//# sourceMappingURL=extensibility.js.map