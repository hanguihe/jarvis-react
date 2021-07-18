import { ProxyConfigMap } from 'webpack-dev-server';

export interface UserConfig {
  mode?: 'app' | 'component';
  outDir?: string;
  sourceMap?: boolean;
  themes?: Record<string, string>;
  proxy?: ProxyConfigMap;
  port?: number;
}

export interface BuildOptions extends UserConfig {
  cwd: string;
  isDevelopment: boolean;
  isProduction: boolean;
  buildType?: 'cjs' | 'esm';
}
