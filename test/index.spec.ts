import { validateContent } from '../src/index'
import * as fs from 'fs'

describe('check test assets', () => {
  it('can check 1', () => {
    validateContent(fs.readFileSync('./test-assets/transferWithCompensation.bpmn').toString())
  })

  it('can check 2', () => {
    validateContent(fs.readFileSync('./test-assets/transferWithCompensationSub.bpmn').toString())
  })
})
