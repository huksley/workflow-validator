import { logger } from './logger'

import BpmnModdle from 'bpmn-moddle'
import * as fs from 'fs'
const CamundaModdleDefinition = JSON.parse(
  fs.readFileSync('./camunda-bpmn-moddle/resources/camunda.json').toString(),
)

export const validateContent = (content: string) => {
  const moddle = new BpmnModdle({ camunda: CamundaModdleDefinition })
  moddle.fromXML(content, (err, bpmn) => {
    logger.info(`Parsed bpmn err: ${err}, ${JSON.stringify(bpmn, null, 2)}`)
  })
}
