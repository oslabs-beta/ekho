const request = require('supertest');

const server = 'http://localhost:3000';

/**
 * Supertest docs: https://www.npmjs.com/package/supertest
 */

describe('Legacy module requests', () => {
  describe('POST', () => {
    // TODO: possibly need to change these tests if we always respond back with 200 regardless of inputs.
    it('responds to a valid request with context with 200 status', () => {
      return request(server)
        .post('/')
        .set('Content-Type', 'application/json')
        .send({
          name: 'mytest',
          context: {userid: 123},
          args: 5,
          runtime: 100,
          result: 42
        })
        .expect(200)
    });

    it('responds to a request with missing fields with the list of fields', () => {
      return request(server)
      .post('/')
      .set('Content-Type', 'application/json')
      .send({
        context: {userid: 123},
        args: 5,
        result: 42
      })
      .expect('Content-Type', 'application/json; charset=utf-8')
      .expect(400)
      .then(err =>  {
        expect(err.body).toEqual('Error: missing required field(s): name, runtime')
      })
    }) 
    it('responds to a request with bad inputs with an appropriate error', () => {
      return request(server)
      .post('/')
      .set('Content-Type', 'application/json')
      .send({
        name: 'mytest',
        context: 123,
        runtime: 100,
        args: 5,
        result: 42
      })
      .expect('Content-Type', 'application/json; charset=utf-8')
      .expect(400)
      .then(err =>  {
        expect(err.body).toEqual('Error: if provided, context must be an object')
      })
    });
  });
});
