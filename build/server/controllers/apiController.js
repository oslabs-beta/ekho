"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_fetch_1 = __importDefault(require("node-fetch"));
const errorHandler_1 = __importDefault(require("../utils/errorHandler"));
const yamlParser_1 = __importDefault(require("../utils/yamlParser"));
const apiController = {
    validateBody: (req, res, next) => {
        const checkRequiredProps = (body) => {
            const missingFields = [];
            if (!Object.hasOwn(body, 'name'))
                missingFields.push('name');
            if (!Object.hasOwn(body, 'args'))
                missingFields.push('args');
            if (!Object.hasOwn(body, 'runtime'))
                missingFields.push('runtime');
            if (!Object.hasOwn(body, 'result'))
                missingFields.push('result');
            if (missingFields.length)
                throw new Error(`missing required field(s): ${missingFields.join(', ')}`);
        };
        const checkTypes = (body) => {
            const { args } = body;
            console.log(args);
            if (typeof args !== 'object' || Array.isArray(args))
                return 'args must be an object containing at least 1 property: body, params, or query';
            if (!Object.hasOwn(args, 'query')
                && !Object.hasOwn(args, 'params')
                && !Object.hasOwn(args, 'body'))
                return 'args must contain at least 1 property: body, params, or query';
            if (Object.hasOwn(args, 'query') && (typeof args.query !== 'object' || Array.isArray(args.query)))
                return 'if provided, query must be an object representing keys/values to be passed as query parameters';
            if (Object.hasOwn(args, 'params') && !Array.isArray(args.params))
                return 'if provided, params must be an array';
            if (Object.hasOwn(body, 'context') && (typeof body.context !== 'object' || Array.isArray(body.context)))
                return 'if provided, context must be an object';
            if (typeof body.runtime !== 'number')
                return 'runtime should be a number representing function runtime in ms';
        };
        try {
            const { body } = req;
            if (!body)
                throw new Error('request missing body');
            checkRequiredProps(body);
            const typeError = checkTypes(body);
            if (typeError)
                throw new Error(typeError);
            return next();
        }
        catch (err) {
            return next((0, errorHandler_1.default)('apiController', 'validateBody', err));
        }
    },
    structureURI: (req, res, next) => {
        const addQueryParams = (uri, queryObj) => {
            // takes in an object and a URI
            // returns the URI with all keys and values related with key=value and concatenated with &
            const queryKeys = Object.keys(queryObj);
            const queryParams = [];
            queryKeys.forEach(el => {
                queryParams.push(`${el}=${JSON.stringify(queryObj[el])}`);
            });
            const queryStr = queryParams.join('&');
            return `${uri}?${queryStr}`;
        };
        const substituteParams = function (uri, paramsArr) {
            let moddedUri = uri;
            paramsArr.forEach((el, idx) => {
                const moddedUriCopy = moddedUri;
                moddedUri = moddedUri.replaceAll(`$${idx + 1}`, `${el}`);
                if (moddedUri === moddedUriCopy)
                    throw new Error(`No placeholder $${idx + 1} found for param ${el}`);
            });
            // Remove any remaining placeholders in the URI
            moddedUri = moddedUri.replaceAll(/\/\$[0-9]+/g, '');
            return moddedUri;
        };
        try {
            // TODO: figure out how to validate the YAML via TypeScript. There's a separate task for this.
            // find the right experiment by looking for one with a matching name
            let experiment;
            for (let i = 0; i < yamlParser_1.default.length; i++) {
                if (yamlParser_1.default[i].name === req.body.name) {
                    experiment = yamlParser_1.default[i];
                    break;
                }
            }
            if (!experiment)
                throw new Error(`No experiment found matching name ${req.body.name}`);
            //default uri to Ekho microservice endpoint 
            let uri = experiment.apiEndpoint;
            const { args } = req.body;
            //re-assign Ekho microservice endpoint if args contains property 'params' OR 'query' ELSE remain at default
            uri = (Object.hasOwn(args, 'params')) ? substituteParams(uri, args.params) : uri;
            uri = (Object.hasOwn(args, 'query')) ? addQueryParams(uri, args.query) : uri;
            res.locals.experiment = experiment;
            res.locals.uri = encodeURI(uri);
            return next();
        }
        catch (err) {
            return next((0, errorHandler_1.default)('apiController', 'structureUri', err));
        }
    },
    callCandidateMicroservice: async (req, res, next) => {
        const { experiment, uri } = res.locals;
        const { args } = req.body;
        // Figure out if this trial should run
        if (experiment.enabledPct < Math.random())
            return;
        // TODO: implement flagged mismatch rules here, or maybe later when we're sending to the DB.
        try {
            const start = Date.now();
            const candidateResponse = await (0, node_fetch_1.default)(uri, {
                method: experiment.method,
                headers: {
                    'Content-Type': 'application/json; charset=utf-8',
                },
                ...(Object.hasOwn(args, 'body') && { body: JSON.stringify(args.body) }),
            });
            const end = Date.now();
            const response = await candidateResponse;
            const parsedResponse = await response.json();
            res.locals.candidateRuntime = end - start;
            res.locals.candidateStatus = candidateResponse.status; // NK: don't know if this is right
            res.locals.candidateResult = parsedResponse;
            return next();
        }
        catch (err) {
            return next((0, errorHandler_1.default)('apiController', 'callCandidateMicroservice', err));
        }
    },
    compareResults: (req, res, next) => {
        try {
            // validate comparison
            res.locals.mismatch = JSON.stringify(req.body.result) !== JSON.stringify(res.locals.candidateResult);
            return next();
        }
        catch (err) {
            return next((0, errorHandler_1.default)('apiController', 'compareResults', err));
        }
    },
};
exports.default = apiController;
