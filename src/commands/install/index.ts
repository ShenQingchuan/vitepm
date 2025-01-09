import type { CommandSetupFn } from '../../types'
import { writeFile } from 'node:fs/promises'
import { exit, cwd as getCwd } from 'node:process'
import generate from '@babel/generator'
import { log, spinner } from '@clack/prompts'
import { ColorStr } from '../../utils/color-string'
import { findViteConfig, getViteConfigObject, parseViteConfig } from '../../utils/parse-vite-config'
import { addPlugin } from './add-plugin'

export async function installPlugin({ name, cwd }: {
  name: string
  cwd: string
}) {
  try {
    log.info(`Installing plugin ${ColorStr.new(name).green().bold().toString()} ...`)

    const loadConfigSpinner = spinner()
    loadConfigSpinner.start('Loading Vite config file ...')
    const viteConfigPath = await findViteConfig({ cwd })
    const viteConfigAST = await parseViteConfig(viteConfigPath)
    loadConfigSpinner.stop('Vite config file loaded!')

    // Vite config file's default export is the config object,
    // user may use `defineConfig` helper or directly write an object literal
    const configObject = getViteConfigObject(viteConfigAST)

    await addPlugin({ viteConfigAST, configObject, pluginName: name })

    // Hack for '@babel/generator':
    const runGenerate = (
      typeof generate === 'function'
        ? generate
        : (generate as any as { default: typeof generate }).default
    ) as typeof generate

    const { code } = runGenerate(viteConfigAST)
    await writeFile(viteConfigPath, code)

    log.success('Plugin has been installed!')
  }
  catch (error) {
    log.error(ColorStr.new(error).red().bold().toString())
    exit(1)
  }
}

export const vpmInstall: CommandSetupFn = ({ program }) => {
  program
    // Shortcut 'i', full command 'install'
    .command('i')
    .alias('install')
    .description('Install a plugin with given package name')
    .argument('<name>', 'the name of the plugin')
    .action(async (name) => {
      installPlugin({ name, cwd: getCwd() })
    })
}
