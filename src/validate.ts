import { logger } from './logger'

import BpmnModdle from 'bpmn-moddle'
const CamundaModdleDefinition = require('camunda-bpmn-moddle/resources/camunda.json')

export const validateContent = (content: string) => {
  const moddle = new BpmnModdle({ camunda: CamundaModdleDefinition })
  moddle.fromXML(content, (err, bpmn) => {
    logger.info(`Parsed bpmn err: ${err}, ${JSON.stringify(bpmn, null, 2)}`)
  })
}
