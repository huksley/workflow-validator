import { validateContent } from '../src/validate'
import * as fs from 'fs'

describe('check test assets', () => {
  it('can check 1', () => {
    return validateContent(
      fs.readFileSync('./test-assets/transferWithCompensation.bpmn').toString(),
    )
  })

  it('can check 2', () => {
    return validateContent(
      fs.readFileSync('./test-assets/transferWithCompensationSub.bpmn').toString(),
    )
  })

  it('can check 3', () => {
    return validateContent('<xml/>')
  })
})
