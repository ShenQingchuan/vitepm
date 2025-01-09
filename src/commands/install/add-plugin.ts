import type { ArrayExpression, ObjectExpression, ObjectProperty } from '@babel/types'
import type { parseViteConfig } from '../../utils/parse-vite-config'
import { arrayExpression, identifier, objectProperty } from '@babel/types'
import { generateImportStmt, generatePluginFactoryCallExpr } from '../../utils/code-generate'
import { PluginImportStyle } from './plugin-import-style'

export async function addPlugin({ viteConfigAST, configObject, pluginName }: {
  viteConfigAST: Awaited<ReturnType<typeof parseViteConfig>>
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
  )) as (ObjectProperty | undefined)
  if (!pluginsField) {
    pluginsField = objectProperty(
      identifier('plugins'),
      arrayExpression([]),
    )
    configObject.properties.push(pluginsField)
  }
  else if (pluginsField.value.type !== 'ArrayExpression') {
    throw new Error('The plugins field must be an array!')
  }

  // Each Vite plugin is a function,
  // but every plugin library has its own way to export itself.
  // So we need to look up a built-in records table to find out how.
  const pluginImportStyle = PluginImportStyle[pluginName]
  if (!pluginImportStyle) {
    throw new Error(`Plugin ${pluginName} is currently not supported!`)
  }

  const importStmt = generateImportStmt(pluginName, pluginImportStyle)
  const pluginFactoryCallExpr = generatePluginFactoryCallExpr(pluginImportStyle)

  // Find the last import statement in the file,
  // and append the new import statement after it
  const lastImportStmtIndex = viteConfigAST.program.body.findLastIndex(stmt => stmt.type === 'ImportDeclaration')
  if (lastImportStmtIndex !== -1) {
    viteConfigAST.program.body.splice(lastImportStmtIndex + 1, 0, importStmt)
  }
  else {
    viteConfigAST.program.body.unshift(importStmt)
  }

  (pluginsField.value as ArrayExpression).elements.push(pluginFactoryCallExpr)
}
