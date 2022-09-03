"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const js_yaml_1 = __importDefault(require("js-yaml"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
let readLocation;
if (process.env.NODE_ENV === 'test') {
    readLocation = path_1.default.join(__dirname, './__mocks__/experiments.yaml');
}
else {
    readLocation = path_1.default.join(__dirname, '../experiments.yaml');
}
const experiments = js_yaml_1.default.loadAll(fs_1.default.readFileSync(readLocation, 'utf-8'));
// console.log('loaded real experiments');
console.log(experiments);
exports.default = experiments;
