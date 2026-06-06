import tseslint from 'typescript-eslint'
import { defineConfig } from 'eslint/config'

export default defineConfig(
  { ignores: ['out', 'dist', '**/*.d.ts'] },
  { extends: [tseslint.configs.recommended] },
  {
    files: ['src/**/*.ts'],
    rules: {
      '@typescript-eslint/naming-convention': 'warn',
      'curly': 'warn',
      'eqeqeq': 'warn',
      'no-throw-literal': 'warn',
      'semi': 'off',
      'quotes': ['warn', 'single'],
      'ts/explicit-function-return-type': 'off',
      'markdown/require-alt-text': 'off',
    },
  },
)
