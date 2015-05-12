/* -*- mode: javascript -*- */
/* @flow */
import {Left, Right} from 'fantasy-eithers'
import {Some, None} from 'fantasy-options'

const isPromise = v => v !== null && typeof v === 'object' && typeof v.then === 'function'


export default (cb) => (req, res) => {
  let handler = (data) => {
    if(isPromise(data)) {
      // If the data is a promise, then bind the handler
      data.then(handler).done()
    } else if(data == None) {
      // If the data is None, respond with a 404 Not Found
      res.status(404).end()
    } else if(data instanceof Some) {
      // If the data is a Some value, unwrap the contained data
      handler(data.x)
    } else if(data instanceof Left) {
      // If the data is a Left value, treat that as a 404 and pass on
      // the contained value for rendering
      res.status(400)
      handler(data.l)
    } else if(data instanceof Right) {
      // If the data is a Right value, just unwrap the contained data
      return handler(data.r)
    } else if(data == undefined && res.statusCode == undefined) {
      // If the data is undefined and the statusCode has not been set,
      // respond with a 204 No Content
      res.status(204).end()
    } else {
      // Finally, serialized the data as JSON
      res.json(data)
    }
  }
  handler(cb(req, res))
}


