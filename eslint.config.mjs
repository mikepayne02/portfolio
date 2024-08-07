// @ts-check

import eslint from '@eslint/js'
import eslintPluginAstro from 'eslint-plugin-astro'

/** @type {import('@typescript-eslint/utils').TSESLint.FlatConfig.ConfigFile} */
export default [
  eslint.configs.recommended,
  ...eslintPluginAstro.configs.recommended,
  ...eslintPluginAstro.configs['jsx-a11y-recommended'],
  {
    ignores: ['dist', '.astro']
  }
]
