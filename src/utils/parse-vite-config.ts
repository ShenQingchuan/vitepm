import { readdir, readFile } from 'node:fs/promises'
import path from 'node:path'
import { parse } from '@babel/parser'

export async function findViteConfig({ cwd: currentDir }: { cwd: string }) {
  const configRegex = /^vite\.config\.m?(?:j|t)s$/

  const files = await readdir(currentDir)
  const configFile = files.find(file => configRegex.test(file))

  if (!configFile) {
    throw new Error('Failed to find vite.config.(m)?(j|t)s in current directory!')
  }

  return path.join(currentDir, configFile)
}

export async function parseViteConfig(configPath: string) {
  const fileContent = await readFile(configPath, 'utf-8')
  const babelAST = parse(
    fileContent,
    {
      sourceType: 'module',
      plugins: ['typescript'],
    },
  )

  return babelAST
}

export function getViteConfigObject(babelAST: ReturnType<typeof parse>) {
  const defaultExport = babelAST.program.body.find(node => node.type === 'ExportDefaultDeclaration')
  if (!defaultExport) {
    throw new Error('Failed to find default export in Vite config file!')
  }

  const defaultExportDeclaration = defaultExport.declaration

  if (defaultExportDeclaration.type === 'ObjectExpression') {
    return defaultExportDeclaration
  }

  if (
    defaultExportDeclaration.type === 'CallExpression'
    && defaultExportDeclaration.callee.type === 'Identifier'
    && defaultExportDeclaration.callee.name === 'defineConfig'
  ) {
    const arg0 = defaultExportDeclaration.arguments[0]
    if (arg0.type === 'ObjectExpression') {
      // Get the first argument of `defineConfig`
      return arg0
    }
    else if (arg0.type === 'ArrowFunctionExpression') {
      const body = arg0.body
      if (body.type === 'ObjectExpression') {
        return body
      }
      else if (body.type === 'BlockStatement') {
        const returnObj = body.body.find(node => node.type === 'ReturnStatement')
        if (returnObj && returnObj.argument?.type === 'ObjectExpression') {
          return returnObj.argument
        }
      }
    }
  }

  throw new Error('Failed to find config object!')
}
