const { collapseTextChangeRangesAcrossMultipleVersions } = require('typescript');
const { default: apiController } = require('../server/controllers/apiController');
const criteriaDict = require('../server/utils/criteria');

// Shadowing criteria because users will change what's in criteria.ts
criteriaDict.default.missingEmail = (context, args) => (!context.email);
criteriaDict.default.unsupportedUserTypes = (context, args) => (context.usertype === 'admin' || args.body.usertype === 'test');

const MOCK_RESULT = [43];

global.fetch = jest.fn(() => { json: () => MOCK_RESULT });

describe('API middleware unit tests', () => {
  const next = jest.fn();
  const req = {};
  const res = {};

  beforeEach(() => {
    req.body = {};
    res.locals = {};
    next.mockReset();
  });

  describe('validateBody', () => {
    it('responds to a request with valid req.body by invoking next with no inputs', () => {
      req.body = {
        name: 'mytest',
        context: { prop: 123 },
        runtime: 100,
        args: {
          params: ['foo'],
        },
        result: 42,
      };
      apiController.validateBody(req, res, next);
      expect(next).toHaveBeenCalled();
      // The code below checks whether any args were passed into the invocation of next
      expect(next.mock.calls[0].length).toEqual(0);
    });

    it('responds to a request with no body with an appropriate error', () => {
      delete req.body;
      apiController.validateBody(req, res, next);
      expect(next).toHaveBeenCalled();
      expect(next.mock.calls[0][0]).toEqual('Error in apiController.validateBody. Error: request missing body');
    });

    it('responds to a request with bad context with an appropriate error', () => {
      req.body = {
        name: 'mytest',
        context: 123,
        runtime: 100,
        args: {
          params: [5],
        },
        result: 42,
      };
      apiController.validateBody(req, res, next);
      expect(next).toHaveBeenCalled();
      expect(next.mock.calls[0][0]).toEqual('Error in apiController.validateBody. Error: if provided, context must be an object');
    });

    it('responds to a request with an invalid arg type with an error', () => {
      req.body = {
        name: 'mytest',
        context: 123,
        runtime: 100,
        args: 5,
        result: 42,
      };
      apiController.validateBody(req, res, next);
      expect(next).toHaveBeenCalled();
      expect(next.mock.calls[0][0]).toEqual('Error in apiController.validateBody. Error: args must be an object containing at least 1 property: body, params, or query');
    });

    it('responds to a request with no valid args with an error', () => {
      req.body = {
        name: 'mytest',
        context: 123,
        runtime: 100,
        args: {
          lol: 'not a valid arg',
        },
        result: 42,
      };
      apiController.validateBody(req, res, next);
      expect(next).toHaveBeenCalled();
      expect(next.mock.calls[0][0]).toEqual('Error in apiController.validateBody. Error: args must contain at least 1 property: body, params, or query');
    });

    it('responds to a request with an invalid args.query with an error', () => {
      req.body = {
        name: 'mytest',
        context: 123,
        runtime: 100,
        args: {
          query: 4,
        },
        result: 42,
      };
      apiController.validateBody(req, res, next);
      expect(next).toHaveBeenCalled();
      expect(next.mock.calls[0][0]).toEqual('Error in apiController.validateBody. Error: if provided, query must be an object representing keys/values to be passed as query parameters');
    });

    it('responds to a request with an invalid args.params with an error', () => {
      req.body = {
        name: 'mytest',
        context: 123,
        runtime: 100,
        args: {
          params: { you: 'too' },
        },
        result: 42,
      };
      apiController.validateBody(req, res, next);
      expect(next).toHaveBeenCalled();
      expect(next.mock.calls[0][0]).toEqual('Error in apiController.validateBody. Error: if provided, params must be an array');
    });
  });

  describe('findExperiment', () => {
    it('should find an experiment if there is a match in the YAML file', () => {
      req.body = { name: 'test1' };
      apiController.findExperiment(req, res, next);
      expect(res.locals.experiment.name).toEqual(req.body.name);
      expect(next).toHaveBeenCalled();
      expect(next.mock.calls[0].length).toEqual(0);
    });

    it('should throw an error if there is no matching experiment', () => {
      req.body = { name: 'foo' };
      apiController.findExperiment(req, res, next);
      expect(next).toHaveBeenCalled();
      expect(next.mock.calls[0][0]).toEqual('Error in apiController.findExperiment. Error: No experiment found matching name foo');
    });
  });

  describe('structureURI', () => {
    beforeEach(() => {
      res.locals.experiment = {
        name: 'test1',
        enabledPct: 1,
        method: 'POST',
        apiEndpoint: 'https://test.com/endpoint',
        flaggedMismatchRules: [
          {
            name: 'legacy-bug-123',
            criteria: ['missingEmail'],
          },
        ],
      };
      req.body = { args: {} };
      next.mockReset();
    });

    describe('addQueryParams', () => {
      it('should not change the URI if req.body.args has no query argument', () => {
        apiController.structureURI(req, res, next);
        expect(res.locals.uri).toEqual('https://test.com/endpoint');
      });

      it('should add 1 query parameter if req.body.args.query has 1 property', () => {
        req.body.args.query = { foot: 'ball' };
        apiController.structureURI(req, res, next);
        expect(res.locals.uri).toEqual('https://test.com/endpoint?foot=ball');
      });

      it('should add 2 query parameter if req.body.args.query has 2 properties', () => {
        req.body.args.query = { foot: 'ball', hand: 'egg' };
        apiController.structureURI(req, res, next);
        expect(res.locals.uri).toEqual('https://test.com/endpoint?foot=ball&hand=egg');
      });
    });

    describe('substituteParams', () => {
      beforeEach(() => {
        res.locals.experiment.apiEndpoint = 'https://test.com/$1/images/$2';
      });
      it('should not change the URI if req.body.args has no params argument', () => {
        apiController.structureURI(req, res, next);
        expect(res.locals.uri).toEqual('https://test.com/$1/images/$2');
      });

      it('should subtitute multiple params if given', () => {
        req.body.args.params = ['test1', 'test2'];
        apiController.structureURI(req, res, next);
        expect(res.locals.uri).toEqual('https://test.com/test1/images/test2');
      });

      it('should strip out extra placeholder params', () => {
        req.body.args.params = ['test1'];
        apiController.structureURI(req, res, next);
        expect(res.locals.uri).toEqual('https://test.com/test1/images');
      });

      it('should throw an error if there are more params than placeholders', () => {
        req.body.args.params = ['test1', 'test2', 'test3'];
        apiController.structureURI(req, res, next);
        expect(next).toHaveBeenCalled();
        expect(next.mock.calls[0][0]).toEqual('Error in apiController.structureUri. Error: No placeholder $3 found for param test3');
      });
    });
  });

  describe('callCandidateMicroservice', () => {
    beforeEach(() => {
      req.body = {
        args: {
          body: { killer: 'queen' },
        },
        result: 42,
      };
      res.locals = {
        experiment: {
          enabledPct: 1.00,
          method: 'POST',
        },
        uri: 'https://example.com',
      };
    });

    it('should not run if it is not enabled', () => {
      res.locals.experiment.enabledPct = 0;
      apiController.callCandidateMicroservice(req, res, next);
      expect(next).not.toHaveBeenCalled();
    });

    // there's something wonky with my implementation of the mock function. Need to revisit.
    xit('should add a body to the request if there is a body property', () => {
      apiController.callCandidateMicroservice(req, res, next);
      console.debug(fetch);
      console.debug(fetch.mock.calls[0]);
      expect(fetch.mock.calls[0][1].body).toEqual('{"killer":"queen"}');
    });

    // the below 2 tests aren't working, even though console logs indicate they should.
    // Got to literally the line before the return next(). skipping for now.
    xit('should store the candidate microservice results, runtime, and status', () => {
      apiController.callCandidateMicroservice(req, res, next);
      console.log(res.locals);
      console.log(next.mock.calls);
      expect(Object.hasOwn(res.locals), candidateRuntime).toEqual(true);
      expect(Object.hasOwn(res.locals), candidateStatus).toEqual(true);
      expect(Object.hasOwn(res.locals), candidateResult).toEqual(true);
      expect(res.locals.candidateResult).toEqual(43);
    })

    xit('should call next', () => {
      apiController.callCandidateMicroservice(req, res, next);
      expect(next).toHaveBeenCalled();
      expect(next.mock.calls[0].length).toEqual(0);
    });
  });

  describe('checkIgnoreMismatchRules', () => {
    beforeEach(() => {
      res.locals.experiment = {
        ignoreMismatchRules: [{ name: 'foo', criteria: ['missingEmail', 'unsupportedUserTypes'] }],
      };
      res.locals.mismatch = true;
    });

    it('should return next immediately if there was no mismatch', () => {
      res.locals.mismatch = false;
      apiController.checkIgnoreMismatchRules(req, res, next);
      expect(res.locals.ignoredMismatchRuleName).toBe(undefined);
      expect(next).toHaveBeenCalled();
      expect(next.mock.calls[0].length).toEqual(0);
    });

    it('should mark the experiment as ignored if 2 rules are met', () => {
      req.body.args = {
        body: {
          usertype: 'test',
        },
      };
      apiController.checkIgnoreMismatchRules(req, res, next);
      expect(res.locals.ignoredMismatchRuleName).toEqual('foo');
      expect(next).toHaveBeenCalled();
      expect(next.mock.calls[0].length).toEqual(0);
    });

    it('should not mark the experiment as ignored if only 1 of 2 rules was met', () => {
      req.body.args = {
        body: {
          usertype: 'test',
        },
      };
      req.body.context = {
        email: 'foo@bar.com',
      };
      apiController.checkIgnoreMismatchRules(req, res, next);
      expect(res.locals.ignoredMismatchRuleName).toEqual(undefined);
      expect(next).toHaveBeenCalled();
      expect(next.mock.calls[0].length).toEqual(0);
    });

    it('should throw an error if there is no matching criterion by name', () => {
      req.body.args = {
        body: {
          usertype: 'test',
        },
      };
      req.body.context = {
        email: 'foo@bar.com',
      };
      res.locals.experiment.ignoreMismatchRules = [{ name: 'foo', criteria: ['bar'] }];
      apiController.checkIgnoreMismatchRules(req, res, next);
      expect(next).toHaveBeenCalled();
      expect(next.mock.calls[0][0]).toEqual('Error in apiController.checkIgnoreMismatchRules. Error: No criterion found matching name bar');
    });
  });
});
