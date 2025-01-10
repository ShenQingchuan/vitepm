import type { PluginImportStyle } from '../types'
import { callExpression, identifier, importDeclaration, importDefaultSpecifier, importSpecifier, stringLiteral } from '@babel/types'

export function generateImportStmt(pluginName: string, pluginStyle: PluginImportStyle) {
  const { importType, importName, importSource } = pluginStyle
  if (importType === 'default') {
    // `import ${importName} from '${pluginName}'`
    return importDeclaration([
      importDefaultSpecifier(identifier(importName)),
    ], stringLiteral(importSource ?? pluginName))
  }
  else if (importType === 'named') {
    // `import { ${importName} } from '${pluginName}'`
    return importDeclaration([
      importSpecifier(identifier(importName), identifier(pluginName)),
    ], stringLiteral(importSource ?? pluginName))
  }
  else {
    throw new Error(`Unknown import type: '${importType}'`)
  }
}

export function generatePluginFactoryCallExpr(pluginStyle: PluginImportStyle) {
  // `${pluginName}()`
  return callExpression(identifier(pluginStyle.importName), [])
}
