import { defineConfig } from 'oxlint';

export default defineConfig({
  categories: {
    correctness: 'error',
    style: 'error',
  },
  env: {
    builtin: true,
  },
  options: {
    denyWarnings: true,
    reportUnusedDisableDirectives: 'error',
    typeAware: true,
    typeCheck: true,
  },
  overrides: [],
  plugins: ['typescript', 'unicorn', 'oxc', 'import', 'jsdoc'],
  rules: {
    'array-callback-return': ['error', { allowImplicit: true }],
    complexity: ['error', { max: 33 }],
    'guard-for-in': 'error',
    'id-length': ['error', { exceptions: ['i', 'j', 'x', 'y', '_', 'z'] }],
    'import/namespace': 'off',
    'import/no-named-export': 'off',
    'import/no-namespace': 'off',
    'import/prefer-default-export': 'off',
    'max-lines': ['error', { max: 300, skipBlankLines: true, skipComments: true }],
    'max-statements': 'off',
    'no-alert': 'error',
    'no-bitwise': 'error',
    'no-console': 'error',
    'no-magic-numbers': 'off',
    'no-param-reassign': 'error',
    "no-ternary": "off",
    'no-unused-expressions': ['error', { allowShortCircuit: true }],
    'no-unused-vars': ['error', { argsIgnorePattern: '^_', caughtErrorsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
    'prefer-template': 'error',
    'sort-imports': 'off',
  },
});
