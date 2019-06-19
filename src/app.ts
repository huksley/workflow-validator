import { Application } from 'probot'
import { logger } from './logger'
import { validateContent } from './validate'

export const appHandler = (app: Application) => {
  logger.info('Created application handler')

  app.on('issues.opened', async context => {
    logger.info('Issues opened', context.payload.issue)
  })

  app.on('pull_request.opened', async context => {
    logger.info('Pull request opened', context.payload.pull_request)
  })

  app.on('pull_request.edited', async context => {
    const pr = context.payload.pull_request
    logger.info('Pull request edited', pr)
    await context.github.issues
      .createComment({
        repo: context.payload.repository.name,
        owner: context.payload.repository.owner.login,
        issue_number: pr.number,
        body: 'Holly macaroni!\n\n```json\n' + JSON.stringify(context.payload, null, 2) + '\n```',
      })
      .then(res => {
        logger.info('Create comment', res)
      })
      .catch(err => {
        logger.warn('Failed to create comment', err)
      })
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
