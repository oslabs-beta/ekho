// import apiController from '../server/controllers/apiController';
const { default: apiController }  = require('../server/controllers/apiController');


describe('API middleware unit tests', () => {
  const next = jest.fn();
  let req;
  // populate res with stuff as needed.
  const res = {};

  beforeEach(() => {
    req = {};
    next.mockReset();
  });

  describe('validateBody', () => {
    it('responds to a request with valid req.body by invoking next with no inputs', () => {
      req.body = {
        name: 'mytest',
        context: { prop: 123 },
        runtime: 100,
        args: {
          params: ['foo']
        },
        result: 42,
      };
      apiController.validateBody(req, res, next);
      console.log(next.mock.calls[0]);
      expect(next).toHaveBeenCalled();
      // The code below checks whether any args were passed into the invocation of next
      expect(next.mock.calls[0].length).toEqual(0);
    });

    it('responds to a request with no body with an appropriate error', () => {
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
      expect(next.mock.calls[0][0]).toEqual('Error in apiController.validateBody. Error: if provided, context must be an object')
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

    it('responds to a request with an invalid args.body with an error', () => {
      req.body = {
        name: 'mytest',
        context: 123,
        runtime: 100,
        args: {
          body: [42],
        },
        result: 42,
      };
      apiController.validateBody(req, res, next);
      expect(next).toHaveBeenCalled();
      expect(next.mock.calls[0][0]).toEqual('Error in apiController.validateBody. Error: if provided, body must be an object that will be passed on as the request body');
    });
  });

  xdescribe('structureURI', () => {
    describe('addQueryParams', () => {
      it('should not be called if req.body.args has no query argument', () => {
        req.body = {
          name: 'mytest',
          context: 123,
          runtime: 100,
          args: {
            params: [42],
          },
          result: 42,
        };
        apiController.structureURI('http://example.com/', req.body);
        expect

      })

      it('should be called once if req.body.args has a query argument', () => {

      })

      it('should add 1 query parameter', () => {

      })

      it('should add more than 1 query parameter', () => {

      })
    })

    xdescribe('substituteParams', () => {
      it('should not be called if req.body.args has no params argument', () => {

      })

      it('should be called once if req.body.args has a params argument', () => {

      })

      it('should substitute 2 params', () => {

      })

      it('should throw an error if there are more params than placeholders', () => {

      })

      it('should strip excess placeholders after all params are added', () => {

      })
    })


  })
});
