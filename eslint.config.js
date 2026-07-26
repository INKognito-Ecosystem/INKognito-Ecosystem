import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist', 'build', '.react-router']),
  {
    files: ['**/*.{js,jsx}'],
    extends: [
      js.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    rules: {
      'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]' }],
      // Los módulos de ruta de React Router v7 exportan `meta`/`loader`/etc
      // junto al componente por convención (root.jsx, src/routes/*, y
      // páginas de módulo como InkognitoHome.jsx) — no es el patrón "helpers
      // sueltos en un archivo de componentes" que esta regla busca evitar.
      'react-refresh/only-export-components': ['warn', {
        allowExportNames: ['meta', 'loader', 'action', 'links', 'Layout', 'shouldRevalidate', 'handle', 'clientLoader', 'clientAction'],
      }],
    },
  },
])
