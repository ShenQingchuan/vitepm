import type { Command } from 'commander'
import type { Vpm } from './vpm'

export type CommandSetupFn = (params: {
  cli: Vpm
  program: Command
}) => void

export interface PluginImportStyleRecord {
  [key: string]: {
    importType: 'default' | 'named'
    importName: string
    defaultOptions: null | Record<string, unknown>
  }
}
