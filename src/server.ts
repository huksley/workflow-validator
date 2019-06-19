// tslint:disable-next-line:no-var-requires
const { serverless } = require('@probot/serverless-lambda')
import { appHandler } from './app'
import { logger } from './logger'

export const serverlessProbotHandler = serverless(appHandler)

export const serverlessHandler = (event: any, context: any, callback: any) => {
  logger.info('invocation', { event, context, callback })
  if (event && event.httpMethod === 'GET') {
    if (event.path === '/') {
      return callback(null, {
        statusCode: 200,
        headers: {
          // Required for CORS support to work
          'Access-Control-Allow-Origin': '*',
          // Required for cookies, authorization headers with HTTPS
          'Access-Control-Allow-Credentials': true,
          'Content-Type': 'text/plain',
        },
        body: 'OK',
      })
    } else {
      return callback(null, {
        statusCode: 404,
        headers: {
          // Required for CORS support to work
          'Access-Control-Allow-Origin': '*',
          // Required for cookies, authorization headers with HTTPS
          'Access-Control-Allow-Credentials': true,
          'Content-Type': 'text/plain',
        },
        body: 'Not found',
      })
    }
  } else {
    return serverlessProbotHandler(event, context)
  }
}
