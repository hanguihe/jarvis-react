import { Configuration } from 'webpack-dev-server';
import { resolveProjectFile } from '../util/function';

export default function (): Configuration {
  return {
    allowedHosts: [],
    compress: true,
    clientLogLevel: 'debug',
    contentBase: resolveProjectFile('dist'),
    watchContentBase: true,
    hot: true,
    hotOnly: false,
    noInfo: true,
    stats: 'none',
    port: 3000,
  };
}
