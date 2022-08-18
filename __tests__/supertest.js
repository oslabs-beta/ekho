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

    it('responds to invalid requests with a 200', () => {
      return request(server)
      .post('/')
      .set('Content-Type', 'application/json')
      .send({
        context: {userid: 123},
        args: 5,
        result: 42
      })
      .expect(200)
    });
  });
});
