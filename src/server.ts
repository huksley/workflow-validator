import { handler } from './app'
import { logger } from './logger'

const serverless = require('serverless-http')
const cors = require('cors')
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const port = process.env.SERVER_PORT || 3000

app.use(cors())
app.use(bodyParser.json({ strict: false }))

// Disable 304 support, works wrong IMO
app.set('etag', false)
// Always send last-modified as current time
app.get('/*', function(_, res, next) {
  res.setHeader('Last-Modified', new Date().toUTCString())
  next()
})

app.get('/*', function(req, res, next) {
  logger.info(`Got POST request ${req}, response ${res}`)
  next()
})

app.post('/*', function(req, res, next) {
  logger.info(`Got POST request ${req}, response ${res}`)
  next()
})

app.use(handler)

// Do something when AWS lambda started
if (process.env.AWS_EXECUTION_ENV !== undefined) {
  // _HANDLER contains specific invocation handler for this NodeJS instance
  console.log('AWS Lambda started, handler', process.env._HANDLER)
} else {
  // Do something when serverless offline started
  if (process.env.IS_OFFLINE === 'true') {
    console.log('Serverless offline started.')
  } else {
    app.listen(port, () => {
      console.log(`Listening on port: ${port}`)
    })
  }
}

process.on('beforeExit', code => {
  console.log('NodeJS exiting, code ' + code)
})

process.on('SIGINT', signal => {
  console.log('Caught interrupt signal ' + signal)
  process.exit(1)
})

export const apiHandler = serverless(app)
