import { logger } from './logger'

/**
 * Original, ES7 module bpm-moddle
 */
// import { BpmnModdle } from 'bpmn-moddle'

/**
 * Webpack generated bpmn-moddle
 * To update use `yarn webpack`
 */
// tslint:disable-next-line:no-var-requires
const bpmnModdleExports = require('bpmn-moddle-gen')
const BpmnModdle = bpmnModdleExports.default

import * as fs from 'fs'

const CamundaModdleDefinition = JSON.parse(
  fs.readFileSync('node_modules/camunda-bpmn-moddle/resources/camunda.json').toString(),
)

export const validateContent = (content: string) => {
  return new Promise((resolve, reject) => {
    const moddle = new BpmnModdle({ camunda: CamundaModdleDefinition })
    logger.info('Got moddle', moddle)
    return moddle.fromXML(content, (err: any, bpmn: any) => {
      logger.info(`Parsed bpmn err: ${err}, ${JSON.stringify(bpmn, null, 2)}`)
      resolve({ err, bpmn })
    })
  })
}
