import { readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { afterAll, describe, expect, test, vi } from 'vitest'
import { installPlugin } from '../src/commands/install'

const __dirname = dirname(fileURLToPath(import.meta.url))

afterAll(() => {
  writeFileSync(
    join(__dirname, '../fixtures', 'vite.config.ts'),
    `
// @ts-nocheck
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [],
})
    `.trim(),
  )
})

describe('vpm install dependency', () => {
  test('should install plugin', async () => {
    const spy = vi.spyOn(process.stdout, 'write')

    await installPlugin({ name: 'vite-plugin-inspect', cwd: join(__dirname, '../fixtures') })

    // Terminal output should contains 'Plugin has been installed'
    const output = spy.mock.calls.map(call => call[0]).join('')
    expect(output).toContain('Plugin has been installed')

    const viteConfig = readFileSync(join(__dirname, '../fixtures', 'vite.config.ts'), 'utf-8')
    expect(viteConfig).toContain('vite-plugin-inspect')
  })
})
