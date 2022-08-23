const apiController = require('../server/controllers/apiController');

describe('API middleware unit tests', () => {
  const next = jest.fn();
  console.log(next);
  let req;
  // populate res with stuff as needed.
  const res = {};

  beforeEach(() => {
    req = {};
    next.mockReset();
    console.log(next);
  });

  describe('validateBody', () => {
    it('responds to a request with valid req.body by invoking next', () => {
      req.body = {
        name: 'mytest',
        context: { prop: 123 },
        runtime: 100,
        args: 5,
        result: 42,
      };
      apiController.validateBody(req, res, next);
      console.log(next.mock.calls[0]);
      expect(next).toHaveBeenCalled();
      expect(next.mock.calls[0].length).toEqual(0);
    });

    it('responds to a request with missing inputs with an error listing the inputs', () => {
      req.body = {};
      apiController.validateBody(req, res, next);
      expect(next).toHaveBeenCalled();
      expect(next.mock.calls[0][0]).toEqual('Error in apiController.validateBody. Error: missing required field(s): name, args, runtime, result')
    });

    it('responds to a request with bad inputs with an appropriate error', () => {
      req.body = {
        name: 'mytest',
        context: 123,
        runtime: 100,
        args: 5,
        result: 42,
      }
      apiController.validateBody(req, res, next);
      expect(next).toHaveBeenCalled();
      expect(next.mock.calls[0][0]).toEqual('Error in apiController.validateBody. Error: if provided, context must be an object')
    });
  });
});
