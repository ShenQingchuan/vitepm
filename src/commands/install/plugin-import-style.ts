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
  'unocss': {
    importType: 'default',
    importName: 'UnoCSS',
    importSource: 'unocss/vite',
  },
  'unplugin-vue-components': {
    importType: 'default',
    importName: 'Components',
    importSource: 'unplugin-vue-components/vite',
  },
  'unplugin-auto-import': {
    importType: 'default',
    importName: 'AutoImport',
    importSource: 'unplugin-auto-import/vite',
  },
}
