module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    tsconfigRootDir: __dirname,
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint/eslint-plugin'],
  extends: ['plugin:@typescript-eslint/recommended', 'plugin:prettier/recommended'],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  ignorePatterns: ['.eslintrc.js'],
  rules: {
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    'func-style': ['error', 'expression'],
    '@typescript-eslint/naming-convention': [
      'error',
      { selector: 'variableLike', format: ['camelCase'] },
      { selector: 'property', format: ['camelCase'] },
      { selector: 'class', format: ['PascalCase'] },
      { selector: 'classMethod', format: ['camelCase'] },
      { selector: 'objectLiteralMethod', format: ['camelCase'] },
    ],
    'prettier/prettier': ['error', { endOfLine: 'auto' }],
    '@typescript-eslint/explicit-function-return-type': ['warn', { allowExpressions: true }], // 함수의 반환 타입 명시
    '@typescript-eslint/no-explicit-any': 'error', // any 사용시 경고
    'max-len': ['error', { code: 120, tabWidth: 2 }],
    indent: 0,
    '@typescript-eslint/indent': ['error', 2],
    'no-else-return': 'warn', // else 뒤에 바로 return 경고
    'brace-style': [1, '1tbs', { allowSingleLine: false }], // 중괄호 스타일을 1tbs로, 단일 라인 중괄호는 x
    'no-confusing-arrow': ['warn', { allowParens: true }], // 혼동을 주는 화살표 함수 경고(괄호를 포함하면 허용)
  },
};
