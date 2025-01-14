import { cpSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { afterAll, afterEach, beforeEach, describe, expect, test, vi } from 'vitest'
import { installPlugin } from '../src/commands/install'

const __dirname = dirname(fileURLToPath(import.meta.url))

beforeEach(() => {
  // Clean up the `fixtures` folder
  rmSync(join(__dirname, 'fixtures'), { recursive: true, force: true })

  // Copy folder `${__dirname}/../fixtures` to `${__dirname}/fixtures`
  cpSync(
    join(__dirname, '../fixtures'),
    join(__dirname, 'fixtures'),
    { recursive: true },
  )
})

afterEach(() => {
  // ...
})

afterAll(() => {
  // Remove `node_modules` folder in `fixtures`
  rmSync(join(__dirname, '../fixtures', 'node_modules'), { recursive: true, force: true })
})

describe('vpm install dependency', () => {
  test('should install plugin', async () => {
    const spy = vi.spyOn(process.stdout, 'write')

    await installPlugin({ name: 'vite-plugin-inspect', cwd: join(__dirname, 'fixtures') })

    // Terminal output should contains 'Plugin has been installed'
    const output = spy.mock.calls.map(call => call[0]).join('')
    expect(output).toContain('Plugin has been installed')

    const viteConfig = readFileSync(join(__dirname, 'fixtures', 'vite.config.ts'), 'utf-8')
    expect(viteConfig).toContain('vite-plugin-inspect')
  })

  test('should install plugin with config file', async () => {
    const spy = vi.spyOn(process.stdout, 'write')

    await installPlugin({ name: 'vite-plugin-inspect', cwd: join(__dirname, 'fixtures'), configPath: 'vite.config.ts' })

    const output = spy.mock.calls.map(call => call[0]).join('')
    expect(output).toContain('Plugin has been installed')

    const viteConfig = readFileSync(join(__dirname, 'fixtures', 'vite.config.ts'), 'utf-8')
    expect(viteConfig).toContain('vite-plugin-inspect')
  })

  test('should resolve config with factory function', async () => {
    const viteConfig = readFileSync(join(__dirname, 'fixtures', 'vite.config.ts'), 'utf-8')
    const newViteConfig = viteConfig.replace(
      /defineConfig\(\{\n\s*plugins:\s*\[\],?\n\s*\}\)/,
      'defineConfig(async () => ({ plugins: [] }))',
    )
    writeFileSync(join(__dirname, 'fixtures', 'vite.config.ts'), newViteConfig)

    const spy = vi.spyOn(process.stdout, 'write')

    await installPlugin({ name: 'vite-plugin-inspect', cwd: join(__dirname, 'fixtures'), configPath: 'vite.config.ts' })

    const output = spy.mock.calls.map(call => call[0]).join('')
    expect(output).toContain('Plugin has been installed')

    const editedViteConfig = readFileSync(join(__dirname, 'fixtures', 'vite.config.ts'), 'utf-8')
    expect(editedViteConfig).toContain('vite-plugin-inspect')
  })
})
