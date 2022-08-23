"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
//IMPORTANT: ts build changes the 'node-fetch' import to a nested require(import). MUST change this to import in the built js file.
const fetch = (url, init) => Promise.resolve().then(() => import('node-fetch')).then(({ default: fetch }) => fetch(url, init));
const ekhojs = {
    //define a wrap method which will surround the monolith code for testing.
    //the method will invoke the cb with passed in inputs and store it as a result
    /*then build a request object body
    experimentName STRING
    context OBJECT
    input OBJECT
    runtime
    result
    */
    //make a post request to Ekho microservice (async)
    //return the result back to the monolith
    wrap: (callback, experimentName, context, Ekhomicroservice, legacyInput, legacyMicroserviceInput) => {
        try {
            const start = Date.now();
            const result = callback(legacyInput);
            const end = Date.now();
            const runtime = end - start;
            const calcRuntime = async (callback, experimentName, context, Ekhomicroservice, legacyInput, legacyMicroserviceInput) => {
                const post = {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        name: experimentName,
                        context: context,
                        legacyInput: legacyInput,
                        MicroserviceInput: {
                            body: legacyMicroserviceInput.body,
                            params: legacyMicroserviceInput.params,
                            query: legacyMicroserviceInput.query
                        },
                        runtime: runtime,
                        result: result,
                    })
                };
                fetch(Ekhomicroservice, post)
                    .then((res) => {
                    if (res.status !== 200)
                        console.log('Ekho Microservice unresponsive');
                });
            };
            calcRuntime(callback, experimentName, context, Ekhomicroservice, legacyInput, legacyMicroserviceInput);
            return result;
        }
        catch (err) {
        }
    }
};
exports.default = ekhojs;
