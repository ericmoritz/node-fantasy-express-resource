import ExpressResource from 'fantasy-express-resource'
import express from 'express'
import expressPromise from 'express-promise'
import bodyParser from 'body-parser'
import {None, Some} from 'fantasy-options'
import {Left, Right} from 'fantasy-eithers'

// This is our in-memory 'database'
const db = {
  _data: {
    'dummy': {
      'key': 'dummy',
      'name': 'Dummy McDumb'
    }
  },

  get: key => new Promise(resolve => {
    if(db._data[key]) resolve(Some(db._data[key]))
    else resolve(None)
  }),
    
  put: (key, data) => new Promise(resolve => {
    db._data[key] = data
    data['key'] = key
    resolve(data)
  })
}

// Require the .name field
const validateData = form => (
  !form.name
    ? Left({'error': '.name is required'})
    : Right(form)
)

const validateBody = form => (
  !form
    ? Left({'error': 'no request body sent'})
    : Right(form)
)

// map a record to a response
const recordToResponse = record => (
  {
    "@id": "/" + record.key,
    "name": record.name,
  }
)

// Get access
export const app = express()
app.use(expressPromise())
app.use(bodyParser.json())

app.get('/:key', ExpressResource(
  (req, res) => db.get(req.params.key).then(
     option => option.map(recordToResponse)
  )
))

const trace = msg => x => {
  console.log(msg, x)
  return x
}

const NullPromise = () => new Promise(resolve => resolve(undefined))

app.put('/:key', ExpressResource(
  (req, res) =>
    validateBody(req.body)
    .chain(validateData)
    .map(
      form => db
        .put(
          req.params.key, form
        ).then(
          _ => {
            res.status(204)
            return NullPromise
          }
        )
    )
))
