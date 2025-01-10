import { execSync } from 'node:child_process'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { env } from 'node:process'
import { log, select } from '@clack/prompts'

function getPackageJsonData(cwd: string): Record<string, any> {
  try {
    const packageJsonPath = join(cwd, 'package.json')
    const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'))
    return packageJson
  }
  catch (err) {
    throw new Error(`Read package.json failed!\n${String(err)}`)
  }
}

export async function checkNpmInstall({ name, cwd }: {
  name: string
  cwd: string
}) {
  const isTest = env.VITEST_ENV === 'true'

  // Read current directory's `package.json`
  const packageJson = getPackageJsonData(cwd)

  // Check `devDependencies` because Vite plugins are always a dev dependency
  if (!packageJson.devDependencies) {
    // Add `devDependencies` field if it doesn't exist
    const newDevDependencies: Record<string, string> = {}
    packageJson.devDependencies = newDevDependencies
  }
  const devDependencies = packageJson.devDependencies

  // Check if the plugin is already installed
  if (devDependencies[name]) {
    log.success('Plugin is already downloaded.')
    return
  }

  // Ask user to select a package manager
  const packageManager = (
    isTest
      ? 'pnpm'
      : await select({
        message: 'Pick a package manager.',
        options: [
          { value: 'pnpm', label: 'pnpm' },
          { value: 'npm', label: 'npm' },
          { value: 'yarn', label: 'yarn' },
        ],
      })
  )

  // Install the plugin
  log.info(`Running ${String(packageManager)} install ...`)
  execSync(`${String(packageManager)} install -D ${name}`, {
    cwd,
    stdio: isTest ? 'ignore' : 'inherit',
  })
  log.success('Plugin package downloaded!')
}
