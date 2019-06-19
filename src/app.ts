import { Application } from 'probot'
import { logger } from './logger'

const addComment = `
  mutation comment($id: ID!, $body: String!) {
    addComment(input: {subjectId: $id, body: $body}) {
      clientMutationId
    }
  }
`

export const appHandler = (app: Application) => {
  app.on('issues.opened', async context => {
    logger.info('Issues opened', context)
    context.github.query(addComment, {})
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

/*github.asApp().then(github => {
  github.apps.listInstallations({}).then(inst => log.info('Installations: ', inst.data))
})
*/
