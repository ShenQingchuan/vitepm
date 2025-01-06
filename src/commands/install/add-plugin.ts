import type { ObjectExpression } from '@babel/types'
import { arrayExpression, identifier, objectProperty } from '@babel/types'
import { PluginImportStyle } from './plugin-import-style'

export async function addPlugin({ configObject, pluginName }: {
  configObject: ObjectExpression
  pluginName: string
}) {
  // find if there is a 'plugins' field in the config object,
  // - If yes: run add operation
  // - If no: create 'plugins' field and then add the plugin
  let pluginsField = configObject.properties.find(property => (
    property.type === 'ObjectProperty'
    && property.key.type === 'Identifier'
    && property.key.name === 'plugins'
  ))
  if (!pluginsField) {
    pluginsField = objectProperty(
      identifier('plugins'),
      arrayExpression([]),
    )
    configObject.properties.push(pluginsField)
  }

  // Each Vite plugin is a function,
  // but every plugin library has its own way to export itself.
  // So we need to look up a built-in records table to find out how.
  const pluginImportStyle = PluginImportStyle[pluginName]
  if (!pluginImportStyle) {
    throw new Error(`Plugin ${pluginName} is currently not supported!`)
  }

  // const { importType, importName, defaultOptions } = pluginImportStyle
}
