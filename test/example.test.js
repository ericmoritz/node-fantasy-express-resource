import {app} from '../example/app'
import request from 'supertest'

const trace = msg => (...args) => {
  console.log(msg, ...args)
  return x
}

describe('example service', () => {
  it('should support PUT 400', done => {
    request(app).put('/ericmoritz')
      .set('Content-Type', 'application/json')
      .expect(400)
      .expect({'error': '.name is required'})
      .end(done)
  })

  it('should support PUT', done => {
      request(app).put('/ericmoritz')
        .set('Content-Type', 'application/json')
        .send({'name': 'Eric Moritz'})
        .expect(200)
        .end(
          () => {
            request(app).get('/ericmoritz')
              .expect(200)
              .expect({'name': 'Eric Moritz', '@id': '/ericmoritz'})
              .end(done)
          }
        )
  })

  it('should support GET 200', done => {
    request(app).get('/dummy')
      .expect(200)
      .expect({'@id': '/dummy', 'name': 'Dummy McDumb'})
      .end(done)
  })

  it('should support GET 404', done => {
    request(app).get('/noone')
      .expect(404)
      .end(done)
  })
})
