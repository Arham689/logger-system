// eslint.config.js
import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import prettier from 'eslint-config-prettier';

export default [
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['**/*.ts'],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: true,
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
    plugins: {
      import: await import('eslint-plugin-import'),
      prettier: await import('eslint-plugin-prettier'),
    },
    rules: {
      'prettier/prettier': 'error',
      'import/order': [
        'warn',
        {
          groups: [['builtin', 'external', 'internal']],
          alphabetize: { order: 'asc', caseInsensitive: true },
        },
      ],
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_' },
      ],
    },
  },
  prettier,
];
