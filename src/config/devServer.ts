import { Configuration } from 'webpack-dev-server';
import { resolveProjectFile } from '../util/function';
import { BuildOptions } from '../type';

export function getServerConfig(options: BuildOptions): Configuration {
  const { outDir = 'dist', proxy = {} } = options;

  return {
    allowedHosts: [],
    compress: true,
    clientLogLevel: 'debug',
    contentBase: resolveProjectFile(outDir),
    watchContentBase: true,
    hot: true,
    hotOnly: false,
    noInfo: true,
    stats: 'none',
    open: false,
    proxy: { ...proxy },
  };
}
