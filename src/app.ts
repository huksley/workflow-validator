import * as createHandler from 'github-webhook-handler'
import * as createApp from 'github-app'
import { config } from './config'
import * as fs from 'fs'

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
  console.log('Installations:')
  github.apps.getInstallations({}).then(inst => console.info('Installations: ', inst.data))
})

handler.on('installation', function(event) {
  if (event.payload.action == 'created') {
    console.log('App installed', event.payload.installation)
  } else if (event.payload.action == 'deleted') {
    console.log('App uninstalled', event.payload.installation)
  }
})
