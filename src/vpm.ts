import type { CommandSetupFn } from './types'
import { argv } from 'node:process'
import { program } from 'commander'
import packageJSON from '../package.json'
import { vpmInstall } from './commands/install'

export class Vpm {
  constructor() { }

  static run() {
    const cli = new Vpm()

    program
      .version(packageJSON.version)
      .name('vpm')
      .usage('<command> [options]')

    cli.setupCommands()

    program.parse(argv)
  }

  setupCommands() {
    const commands: CommandSetupFn[] = [
      vpmInstall,
    ]

    for (const setupCommand of commands) {
      setupCommand({ cli: this, program })
    }
  }
}
