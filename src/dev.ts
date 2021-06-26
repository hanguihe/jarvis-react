import webpack from 'webpack';
import Server from 'webpack-dev-server';
import { logger } from './util/function';
import getConfig from './webpack';

process.env.NODE_ENV = 'development';

function dev() {
  logger.cyan('start development server...');

  const { webpackConfig, serverConfig } = getConfig('development', true);

  const compiler = webpack(webpackConfig);

  compiler.hooks.invalid.tap('invalid', () => {
    logger.cyan('start compilie...');
  });

  compiler.hooks.done.tap('done', (stats) => {
    const info = stats.toJson({ all: false, errors: true, warnings: true });

    if (Array.isArray(info.errors) && info.errors.length > 0) {
      console.log();
      logger.error('fail to compilie');

      info.errors.forEach((item) => {
        console.error(item.moduleName);
        console.error(item.message);
      });
      return;
    }

    if (Array.isArray(info.warnings) && info.warnings.length > 0) {
      logger.warn('compile with warnings..');
      info.warnings.forEach((item) => {
        console.error(item.moduleName);
        console.error(item.message);
      });
    }

    console.log();
    logger.success('success to compile \n');
  });

  // @ts-ignore
  const server = new Server(compiler, serverConfig);
  server.listen(serverConfig.port || 3000, serverConfig.host || 'localhost', (err) => {
    if (err) {
      logger.error('compile with errors');
      throw err;
    }
  });
}

module.exports = dev;
