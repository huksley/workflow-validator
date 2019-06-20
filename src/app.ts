import { Application, Context } from 'probot'
import { logger } from './logger'
import { validateContent } from './validate'
import { listGitFiles } from './git'

import fs from 'fs'
import { WebhookPayloadPullRequest } from '@octokit/webhooks'

export const validate = async (context: Context<WebhookPayloadPullRequest>) => {
  const pr = context.payload.pull_request
  logger.info('Pull request edited', pr)

  context.github.repos.createStatus({
    context: 'Workflow-validator',
    description: 'Checking',
    repo: context.payload.repository.name,
    owner: context.payload.repository.owner.login,
    state: 'pending',
    sha: pr.head.sha,
  })

  const ll = await listGitFiles(pr)
  const bpmnFiles = ll.filter(f => f.endsWith('.bpmn'))
  const check = await Promise.all(
    bpmnFiles.map(
      file =>
        new Promise<{ file: string; success: boolean; result: string }>(async (resolve, reject) => {
          await validateContent(fs.readFileSync(file).toString()).then(s => {
            logger.info('Validation result', s)
            resolve({
              file,
              success: !s.error,
              result: s.error ? 'Failed' + s.error : 'Succeeded',
            })
          })
        }),
    ),
  )

  const errors = check.filter(f => !f.success).length

  // JSON.stringify(ll, null, 2) + '\n\n' +
  await context.github.issues
    .createComment({
      repo: context.payload.repository.name,
      owner: context.payload.repository.owner.login,
      issue_number: pr.number,
      body: 'List of files ' + JSON.stringify(check, null, 2),
      // body: 'Holly macaroni!\n\n```json\n' + JSON.stringify(context.payload, null, 2) + '\n```',
    })
    .then(res => {
      logger.info('Create comment', res)
    })
    .catch(err => {
      logger.warn('Failed to create comment', err)
    })

  context.github.repos.createStatus({
    context: 'Workflow-validator',
    description: errors > 0 ? 'Found errors in ' + errors + ' files' : 'Check done ok',
    repo: context.payload.repository.name,
    owner: context.payload.repository.owner.login,
    state: errors > 0 ? 'failure' : 'success',
    sha: pr.head.sha,
  })
}

export const appHandler = (app: Application) => {
  logger.info('Created application handler')

  app.on('issues.opened', async context => {
    logger.info('Issues opened', context.payload.issue)
  })

  app.on('pull_request.opened', async context => {
    logger.info('Pull request opened', context.payload.pull_request)
  })

  app.on('pull_request.synchronize', async context => {
    await validate(context)
  })

  app.on('pull_request.edited', async context => {
    await validate(context)
  })

  app.on('pull_request.labeled', async context => {
    logger.info('Pull request labelled', context.payload.pull_request)
    await validateContent('<xml/>').then(s => {
      logger.info('Validation result', s)
    })
  })

  app.on('installation', async event => {
    if (event.payload.action === 'created') {
      logger.info('App installed', event.payload.installation)
    } else if (event.payload.action === 'deleted') {
      logger.info('App uninstalled', event.payload.installation)
    }
  })

  app.on('push', async context => {
    context.log('Code was pushed to the repo, what should we do with it?')
  })
}
