module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    'airbnb-base',
    'plugin:import/typescript',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 13,
    sourceType: 'module',
  },
  plugins: [
    '@typescript-eslint',
  ],
  rules: {
    'no-console': 'off',
    'no-continue': 'off',
    'no-restricted-syntax': 'off',
    'guard-for-in': 'off',
    'import/extensions': ['error', 'ignorePackages', { ts: 'never' }],
  },
};
