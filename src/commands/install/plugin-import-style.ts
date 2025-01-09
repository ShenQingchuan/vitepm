import type { PluginImportStyleRecord } from '../../types'

export const PluginImportStyle: PluginImportStyleRecord = {
  'vite-plugin-inspect': {
    importType: 'default',
    importName: 'Inspect',
  },
  'vue-vine/vite': {
    importType: 'named',
    importName: 'VineVitePlugin',
  },
}
