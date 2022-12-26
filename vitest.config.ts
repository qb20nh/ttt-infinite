import { defineConfig } from 'vitest/config'
import GithubActionsReporter from 'vitest-github-actions-reporter'

export default defineConfig({
  test: {
    environment: 'happy-dom',
    reporters: process.env.GITHUB_ACTIONS === undefined
      ? ['default', new GithubActionsReporter()]
      : 'default'
  }
})
