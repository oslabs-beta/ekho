module.exports = {
  plugins: [
    "@typescript-eslint",
    "jest",
  ],
  extends: [
    'airbnb-base',
    'airbnb-base/whitespace',
    'airbnb-typescript/base',
    'plugin:@typescript-eslint/recommended',
    'plugin:jest/recommended',
  ],
  parserOptions: {
    project: './tsconfig.json'
  },
  root: true,
  env: {
    browser: true,
    node: true,
    jest: true,
  },
  rules: {
    'arrow-parens': 'off',
    'consistent-return': 'off',
    'func-names': 'off',
    'import/extensions': [0, 'ignorePackages'],
    'no-console': 'off',
    'no-plusplus': 'off',
    radix: 'off',
    'react/button-has-type': 'off',
    'react/destructuring-assignment': 'off',
    'react/jsx-filename-extension': 'off',
    'react/prop-types': 'off',
    // 'expect-expect': ['warn', { "assertFunctionNames": ["expect", "request.**.expect"] }]
  },
};
