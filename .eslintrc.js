module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: [
    'plugin:vue/vue3-essential',
    'eslint:recommended',
    '@vue/typescript/recommended'
  ],
  parserOptions: {
    ecmaVersion: 2020,
    parser: "@typescript-eslint/parser",
  },
  rules: {
    "@typescript-eslint/explicit-function-return-type": 'off',
    "@typescript-eslint/explicit-module-boundary-types": 'off',
    "@typescript-eslint/no-explicit-any": ["off"]
  }
}
