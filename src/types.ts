import type { Command } from 'commander'
import type { Vpm } from './vpm'

export type CommandSetupFn = (params: {
  cli: Vpm
  program: Command
}) => void

export interface PluginImportStyle {
  importType: 'default' | 'named'
  importName: string
}

export interface PluginImportStyleRecord {
  [key: string]: PluginImportStyle
}
