import { logger } from './logger'

/**
 * Webpack generated bpmn-moddle-gen from bpmn-moddle so it will be consumable by node, serverless, typescript, AWS Lambda
 * To update use `yarn webpack`,
 * don`t use import!
 */
// tslint:disable-next-line:no-var-requires
const bpmnModdleExports = require('bpmn-moddle-gen')
const BpmnModdle = bpmnModdleExports.default

import * as fs from 'fs'

const CamundaModdleDefinition = JSON.parse(
  fs.readFileSync('node_modules/camunda-bpmn-moddle/resources/camunda.json').toString(),
)

export const validateContent = (content: string) => {
  return new Promise<{ error: string; bpmn: any }>((resolve, reject) => {
    const moddle = new BpmnModdle({ camunda: CamundaModdleDefinition })
    logger.info('Got moddle', moddle)
    return moddle.fromXML(content, (error: any, bpmn: any) => {
      logger.info(`Parsed bpmn err: ${error}, ${JSON.stringify(bpmn, null, 2)}`)
      resolve({ error, bpmn })
    })
  })
}
