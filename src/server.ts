// tslint:disable-next-line:no-var-requires
const serverless = require('serverless-http')
const { serverlessProbot } = require('@probot/serverless-lambda')

import * as cors from 'cors'
import * as express from 'express'
import * as bodyParser from 'body-parser'

import { createServer } from 'probot/lib/server'

import { appHandler } from './app'
import { logger } from './logger'

const router = express()
const port = process.env.SERVER_PORT || 3000

router.use(cors())
router.use(bodyParser.json({ strict: false }))

const requests: any[] = []

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
router.set('etag', false)
// Always send last-modified as current time
router.get('/*', (_, res, next) => {
  res.setHeader('Last-Modified', new Date().toUTCString())
  next()
})

router.get('/*', (req, _, next) => {
  logger.info(`Got GET request ${JSON.stringify(req, getCircularReplacer(), 2)}`)
  next()
})

router.post('/*', (req, _, next) => {
  logger.info(`Got POST request ${JSON.stringify(req, getCircularReplacer(), 2)}`)
  next()
})

router.post('/__requests', (__, response, _) => {
  response.send(requests)
})

router.use(handler)

// Do something when AWS lambda started
if (process.env.AWS_EXECUTION_ENV !== undefined) {
  // _HANDLER contains specific invocation handler for this NodeJS instance
  logger.info('AWS Lambda started, handler', process.env._HANDLER)
} else {
  // Do something when serverless offline started
  if (process.env.IS_OFFLINE === 'true') {
    logger.info('Serverless offline started.')
  } else {
    router.listen(port, () => {
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

export const apiHandler = serverless(router)
