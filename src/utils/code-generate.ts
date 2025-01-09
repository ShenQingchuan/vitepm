import type { PluginImportStyle } from '../types'
import { callExpression, identifier, importDeclaration, importDefaultSpecifier, importSpecifier, stringLiteral } from '@babel/types'

export function generateImportStmt(pluginName: string, pluginStyle: PluginImportStyle) {
  const { importType, importName } = pluginStyle
  if (importType === 'default') {
    // `import ${importName} from '${pluginName}'`
    return importDeclaration([
      importDefaultSpecifier(identifier(importName)),
    ], stringLiteral(pluginName))
  }
  else if (importType === 'named') {
    // `import { ${importName} } from '${pluginName}'`
    return importDeclaration([
      importSpecifier(identifier(importName), identifier(pluginName)),
    ], stringLiteral(pluginName))
  }
  else {
    throw new Error(`Unknown import type: '${importType}'`)
  }
}

export function generatePluginFactoryCallExpr(pluginStyle: PluginImportStyle) {
  // `${pluginName}()`
  return callExpression(identifier(pluginStyle.importName), [])
}
