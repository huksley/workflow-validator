import { apiResponse, findPayload } from './util'
import { Context as LambdaContext, APIGatewayEvent, Callback as LambdaCallback } from 'aws-lambda'
import { logger as log, logger } from './logger'

import BpmnModdle from 'bpmn-moddle'
const CamundaModdleDefinition = require('camunda-bpmn-moddle/resources/camunda.json')

export const validateContent = (content: string) => {
  const moddle = new BpmnModdle({ camunda: CamundaModdleDefinition })
  moddle.fromXML(content, (err, bpmn) => {
    logger.info(`Parsed bpmn err: ${err}, ${JSON.stringify(bpmn, null, 2)}`)
  })
}

import { handler } from './app'

/** Invoked on API Gateway call */
export const postHandler = (
  event: APIGatewayEvent,
  context: LambdaContext,
  callback: LambdaCallback,
) => {
  log.info(
    'event(' +
      typeof event +
      ') ' +
      JSON.stringify(event, null, 2) +
      ' context ' +
      JSON.stringify(context, null, 2),
  )

  const payload = findPayload(event)
  log.info(`Using payload and sending to ${handler}`, payload)
  apiResponse(event, context, callback).success(payload)
}
