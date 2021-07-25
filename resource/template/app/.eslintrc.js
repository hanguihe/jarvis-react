module.exports = {
  extends: [require.resolve('@umijs/fabric/dist/eslint')],
  plugins: ['react-hooks'],
  rules: {
    '@typescript-eslint/consistent-type-imports': 'off',
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
  },
};
