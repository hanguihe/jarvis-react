import { getUserConfig } from '../util/function';
import buildComponent from './component';
import buildApp from './app';

function build() {
  process.env.NODE_ENV = 'production';

  const userConfig = getUserConfig();

  const options = {
    ...userConfig,
    cwd: process.cwd(),
    isDevelopment: false,
    isProduction: true,
  };

  if (userConfig.mode === 'component') {
    return buildComponent(options);
  }

  return buildApp(options);
}

module.exports = build;
