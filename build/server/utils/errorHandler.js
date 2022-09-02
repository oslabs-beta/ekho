"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const createErr = (file, method, err) => (`Error in ${file}.${method}. ${err}`);
exports.default = createErr;
