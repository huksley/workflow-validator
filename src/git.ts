import fs from 'fs'
import * as git from 'isomorphic-git'
import { WebhookPayloadPullRequestPullRequest } from '@octokit/webhooks'
import { logger } from './logger'
import { promisify } from 'util'
import { resolve } from 'path'

git.plugins.set('fs', fs)

const readdir = promisify(fs.readdir)
const stat = promisify(fs.stat)

async function getFiles(dir: string): Promise<string[]> {
  const subdirs = await readdir(dir)
  const files = await Promise.all(
    subdirs.map(async subdir => {
      const res = resolve(dir, subdir)
      return (await stat(res)).isDirectory() ? getFiles(res) : [res]
    }),
  )
  return files.reduce((a, f) => a.concat(f), [])
}

export const listGitFiles = async (pr: WebhookPayloadPullRequestPullRequest) => {
  const url = pr.head.repo.clone_url
  const ref = pr.head.ref
  const dir = fs.mkdtempSync('/tmp/clone-')
  logger.info(`cloning...`)
  await git.clone({ dir, url, ref, singleBranch: true, depth: 1 })
  return getFiles(dir)
}
