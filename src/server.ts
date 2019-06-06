// tslint:disable-next-line:no-var-requires
const serverless = require('serverless-http')

import * as cors from 'cors'
import * as express from 'express'
import * as bodyParser from 'body-parser'

import { handler } from './app'
import { logger } from './logger'

const app = express()
const port = process.env.SERVER_PORT || 3000

app.use(cors())
app.use(bodyParser.json({ strict: false }))

const getCircularReplacer = () => {
  const seen = new WeakSet()
  return ({}, value) => {
    if (typeof value === 'object' && value !== null) {
      if (seen.has(value)) {
        return '**CIRCULAR**'
      }
      seen.add(value)
    }
    return value
  }
}

// Disable 304 support, works wrong IMO
app.set('etag', false)
// Always send last-modified as current time
app.get('/*', (_, res, next) => {
  res.setHeader('Last-Modified', new Date().toUTCString())
  next()
})

app.get('/*', (req, _, next) => {
  logger.info(`Got GET request ${JSON.stringify(req, getCircularReplacer(), 2)}`)
  next()
})

app.post('/*', (req, _, next) => {
  logger.info(`Got POST request ${JSON.stringify(req, getCircularReplacer(), 2)}`)
  next()
})

app.use(handler)

// Do something when AWS lambda started
if (process.env.AWS_EXECUTION_ENV !== undefined) {
  // _HANDLER contains specific invocation handler for this NodeJS instance
  logger.info('AWS Lambda started, handler', process.env._HANDLER)
} else {
  // Do something when serverless offline started
  if (process.env.IS_OFFLINE === 'true') {
    logger.info('Serverless offline started.')
  } else {
    app.listen(port, () => {
      logger.info(`Listening on port: ${port}`)
    })
  }
}

process.on('beforeExit', code => {
  logger.info('NodeJS exiting, code ' + code)
})

process.on('SIGINT', signal => {
  logger.info('Caught interrupt signal ' + signal)
  process.exit(1)
})

export const apiHandler = serverless(app)
