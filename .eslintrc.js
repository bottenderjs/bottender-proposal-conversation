module.exports = {
  root: true,
  extends: [
    'yoctol-base',
    'prettier',
  ],
  env: {
    node: true,
    jest: true,
    jasmine: true,
  },
  rules: {
    'import/no-extraneous-dependencies': 'off',
    'import/extensions': 'off',
  },
};
