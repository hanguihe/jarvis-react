import ora from 'ora';
import Webpack from 'webpack';
import Server from 'webpack-dev-server';
import { getWebpackConfig } from '../config/webpack';
import { getServerConfig } from '../config/devServer';
import { convertTime, getUserConfig, logger } from '../util/function';

function start() {
  logger.cyan('start development server...');

  process.env.NODE_ENV = 'development';
  const spinner = ora();

  const userConfig = getUserConfig();
  const options = {
    ...userConfig,
    cwd: process.cwd(),
    isDevelopment: true,
    isProduction: false,
    port: 3000,
  };

  const webpackConfig = getWebpackConfig(options);
  const serverConfig = getServerConfig(options);

  const compiler = Webpack(webpackConfig);

  compiler.hooks.invalid.tap('invalid', () => {
    spinner.start('start compile...');
  });

  compiler.hooks.done.tap('done', (stats) => {
    const info = stats.toJson({ all: false, errors: true, warnings: true, timings: true });

    if (Array.isArray(info.errors) && info.errors.length > 0) {
      spinner.fail('fail to compile');

      info.errors.forEach((item) => {
        console.error(item.moduleName);
        console.error(item.message);
      });
      return;
    }

    if (Array.isArray(info.warnings) && info.warnings.length > 0) {
      spinner.warn('compile with warnings');
      info.warnings.forEach((item) => {
        console.error(item.moduleName);
        console.error(item.message);
      });
    }

    spinner.succeed(`success to compile with ${convertTime(info.time)} \n`);
  });

  // @ts-ignore
  const server = new Server(compiler, serverConfig);
  server.listen(options.port, 'localhost', (err) => {
    if (err) {
      logger.error('compile with errors');
      throw err;
    }
  });
}

module.exports = start;
