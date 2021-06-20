export const configurationInfo = new Map([
  [
    '.editorconfig',
    {
      description: '编辑器配置文件：.editorconfig',
      needDepend: [],
    },
  ],
  [
    '.eslintrc.js',
    {
      description: 'eslint配置文件：.eslintrc.js',
      needDepend: ['eslint', '@umijs/fabric', 'eslint-plugin-react-hooks'],
    },
  ],
  [
    '.eslintignore',
    {
      description: 'eslint忽略文件：.eslintignore',
      needDepend: [],
    },
  ],
  [
    '.prettierrc',
    {
      description: 'prettier配置文件：.prettierrc.js',
      needDepend: ['prettier', '@umijs/fabric'],
    },
  ],
  [
    '.prettierignore',
    {
      description: 'prettier忽略文件：.prettierignore',
      needDepend: ['prettier', '@umijs/fabric'],
    },
  ],
  [
    '.stylelintrc.js',
    {
      description: 'stylelint配置文件：.stylelintrc.js',
      needDepend: ['@umijs/fabric'],
    },
  ],
  [
    'tsconfig.json',
    {
      description: 'typescript配置文件：tsconfig.json',
      needDepend: [],
    },
  ],
  [
    'jsconfig.json',
    {
      description: 'javascript配置文件：jsconfig.json',
      needDepend: [],
    },
  ],
  [
    '.gitignore',
    {
      description: 'git忽略文件：.gitignore',
      needDepend: [],
    },
  ],
]);

export const scripts = {
  prettier: 'prettier -c --write "src/**/*"',
  'style-fix': 'stylelint --fix "src/**/*.less" --syntax less',
  'eslint-fix': 'eslint --fix --cache --ext .js,.jsx,.ts,.tsx --format=pretty ./src',
};
