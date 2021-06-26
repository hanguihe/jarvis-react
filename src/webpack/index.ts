import { Configuration } from 'webpack';
import { Configuration as ServerConfig } from 'webpack-dev-server';
import { getProjectConfig } from '../util/function';
import getWebpackConfig from './config';
import getServerConfig from './devServer';

function initThemes(themes: any) {
  const { antd, ...rest } = themes;

  if (antd) {
    const { getThemeVariables } = require(require.resolve('antd/dist/theme'));
    return getThemeVariables({
      [themes.antd]: true,
      ...rest,
    });
  } else {
    return { ...rest };
  }
}

export default function initWebpackConfig(mode: 'development' | 'production'): {
  webpackConfig: Configuration;
};
export default function initWebpackConfig(
  mode: 'development' | 'production',
  server: true,
): {
  webpackConfig: Configuration;
  serverConfig: ServerConfig;
};

export default function initWebpackConfig(
  mode: 'development' | 'production',
  server: boolean = false,
) {
  const pjtConfig = getProjectConfig();
  const webpackConfig = getWebpackConfig(mode);

  if (pjtConfig.themes) {
    // @ts-ignore
    const lessRule = webpackConfig.module.rules[1].oneOf[4].use[2];
    lessRule.options.lessOptions.modifyVars = initThemes(pjtConfig.themes);
  }

  if (!server) {
    return { webpackConfig };
  }

  const serverConfig = getServerConfig();
  const { proxy, port } = pjtConfig;
  if (proxy) {
    serverConfig.proxy = proxy;
  }
  if (port) {
    serverConfig.port = port;
  }

  return { webpackConfig, serverConfig };
}
