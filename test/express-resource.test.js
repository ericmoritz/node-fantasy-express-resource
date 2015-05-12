import ExpressResource from 'fantasy-express-resource'
import expressPromise from 'express-promise'
import express from 'express'
import expect from 'expect'
import request from 'supertest'
import Q from 'q'
import {Some, None} from 'fantasy-options'
import {Left, Right} from 'fantasy-eithers'


const createApp = (cb) => {
  let app = express()
  app.use(expressPromise())
  app.get('/', cb)
  return app
}


const promiseValue = val =>
  new Promise(resolve => resolve(val))


const promiseError = err => 
  new Promise((_, reject) => reject(err))


describe("ExpressResponse", () => {
  describe("ES6 Promise support", () => {
    it("it should support successful promises", done => {
      let app = createApp(
        ExpressResource(
          (req, res) => promiseValue({'foo': 1})
        )
      )
      request(app).get('/')
        .expect(200)
        .expect({'foo': 1})
        .end(done)
    })

    it("it should support promise errors", done => {
      let app = createApp(
        ExpressResource(
          (req, res) =>
            promiseError('crap')
        )
      )      
      request(app).get('/').expect(500).end(done)
    })

  })
  describe('fantasy-options support', () => {
    describe('None -> 404', () => {
      it('it should support None', done => {
        let app = createApp(
          ExpressResource(
            (req, res) => None
          )
        )
        request(app).get('/').expect(404).end(done)
      })

      it('it should support Promised None', done => {
        let app = createApp(
          ExpressResource(
            (req, res) => promiseValue(None)
          )
        )
        request(app).get('/')
          .expect(404)
          .end(done)
      })
    })
    describe('Some unwrapping', () => {
      it('unwrap data', done => {
        let app = createApp(
          ExpressResource(
            (req, res) => Some({'foo': 1})
          )
        )
        request(app).get('/')
          .expect(200)
          .expect({'foo': 1})
          .end(done)
      })
    })
    describe('Promised Some unwrapping', () => {
      it('unwrap data', done => {
        let app = createApp(
          ExpressResource(
            (req, res) => promiseValue(Some({'foo': 1}))
          )
        )
        request(app).get('/')
          .expect(200)
          .expect({'foo': 1})
          .end(done)
      })
    })
  })
  describe('Either support', () => {
    it('Left -> 400', done => {
      let app = createApp(
        ExpressResource(
          (req, res) => Left({'error': 'bad request data'})
        )
      )
      request(app).get('/')
        .expect(400)
        .expect({'error': 'bad request data'})
        .end(done)
    })

    it('Promised Left -> 400', done => {
      let app = createApp(
        ExpressResource(
          (req, res) => promiseValue(Left({'error': 'bad request data'}))
        )
      )
      request(app).get('/')
        .expect(400)
        .expect({'error': 'bad request data'})
        .end(done)
    })

    it('Right unwrap', done => {
      let app = createApp(
        ExpressResource(
          (req, res) => Right({'foo': 1})
        )
      )
      request(app).get('/')
        .expect(200)
        .expect({'foo': 1})
        .end(done)
    })

    it('promised Right unwrap', done => {
      let app = createApp(
        ExpressResource(
          (req, res) => promiseValue(Right({'foo': 1}))
        )
      )
      request(app).get('/')
        .expect(200)
        .expect({'foo': 1})
        .end(done)
    })
  })

  it('allows for arbitrary nesting of types', done => {
      let app = createApp(
        ExpressResource(
          (req, res) => promiseValue(
            Right(
              promiseValue(
                Some(
                  Right(
                    promiseValue({'foo': 1})
                  )
                )
              )
            )
          )
        )
      )
      request(app).get('/')
        .expect(200)
        .expect({'foo': 1})
        .end(done)
  })
})
