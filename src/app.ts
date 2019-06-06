import * as createHandler from 'github-webhook-handler'
import * as createApp from 'github-app'
import { config } from './config'
import * as fs from 'fs'
import { logger } from './logger'

export const handler = (createHandler as any)({
  path: config.APP_PATH,
  secret: config.APP_SECRET,
})

const app = createApp({
  id: config.APP_ID,
  // The private key for your app, which can be downloaded from the
  // app's settings: https://github.com/settings/apps
  cert: fs.readFileSync(config.APP_PRIVATE_KEY_PATH),
})

app.asApp().then(github => {
  github.apps.listInstallations({}).then(inst => logger.info('Installations: ', inst.data))
})

handler.on('installation', event => {
  if (event.payload.action === 'created') {
    logger.info('App installed', event.payload.installation)
  } else if (event.payload.action === 'deleted') {
    logger.info('App uninstalled', event.payload.installation)
  }
})
