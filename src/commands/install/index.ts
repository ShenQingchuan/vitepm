import type { CommandSetupFn } from '../../types'
import { exit } from 'node:process'
import { log, spinner } from '@clack/prompts'
import { ColorStr } from '../../utils/color-string'
import { getViteConfigObject, parseViteConfig } from '../../utils/parse-vite-config'
import { addPlugin } from './add-plugin'

export const vpmInstall: CommandSetupFn = ({ program }) => {
  program
    // Shortcut 'i', full command 'install'
    .command('i')
    .alias('install')
    .description('Install a plugin with given package name')
    .argument('<name>', 'the name of the plugin')
    .action(async (name) => {
      try {
        log.info(`Installing plugin ${ColorStr.new(name).green().bold().toString()} ...`)

        const loadConfigSpinner = spinner()
        loadConfigSpinner.start('Loading Vite config file ...')
        const viteConfigAST = await parseViteConfig()
        loadConfigSpinner.stop('Vite config file loaded!')

        // Vite config file's default export is the config object,
        // user may use `defineConfig` helper or directly write an object literal
        const configObject = getViteConfigObject(viteConfigAST)

        await addPlugin({ configObject, pluginName: name })
      }
      catch (error) {
        log.error(
          ColorStr.new(error).red().bold().toString(),
        )
        exit(1)
      }
    })
}
