import { execFileSync } from 'node:child_process'
import { readFile, writeFile } from 'node:fs/promises'
import type { ContributionSnapshot } from '../src/components/contributions/calendar'
import { syncContributionSnapshot } from './contribution-sources'

function localToken(service: 'github' | 'gitea') {
  try {
    if (service === 'github')
      return execFileSync('gh', ['auth', 'token'], { stdio: ['ignore', 'pipe', 'ignore'] })
        .toString()
        .trim()
    const credentials = execFileSync('tea', ['login', 'helper', 'get'], {
      input: 'protocol=https\nhost=gitea.natelinyoungnas.com\n\n',
      stdio: ['pipe', 'pipe', 'ignore'],
    }).toString()
    return credentials
      .split('\n')
      .find((line) => line.startsWith('password='))
      ?.slice('password='.length)
  } catch {
    return undefined
  }
}

const useLocal = process.argv.includes('--local')
const tokens = {
  github: process.env.CONTRIBUTIONS_GITHUB_TOKEN || (useLocal ? localToken('github') : undefined),
  gitea: process.env.CONTRIBUTIONS_GITEA_TOKEN || (useLocal ? localToken('gitea') : undefined),
}

if (!tokens.github && !tokens.gitea) {
  console.log('No contribution tokens configured; keeping the existing count-only snapshot.')
} else {
  const path = new URL('../src/components/contributions/data.json', import.meta.url)
  const previous = JSON.parse(await readFile(path, 'utf8')) as ContributionSnapshot
  const snapshot = await syncContributionSnapshot(previous, tokens)
  await writeFile(path, `${JSON.stringify(snapshot, null, 2)}\n`)
  for (const source of ['github', 'gitea'] as const) {
    console.log(`${source}: ${snapshot.sources[source].status} (daily counts only)`)
  }
}
