import { ProxyConfigMap } from 'webpack-dev-server';

export type BuildType = 'cjs' | 'esm' | 'umd';

export interface UserConfig {
  mode?: 'app' | 'component';
  outDir?: string;
  sourceMap?: boolean;
  themes?: Record<string, string>;
  proxy?: ProxyConfigMap;
  port?: number;
  umd?: boolean;
  globals?: Record<string, string>;
  name?: string;
  external?: string[];
}

export interface BuildOptions extends UserConfig {
  cwd: string;
  isDevelopment: boolean;
  isProduction: boolean;
  buildType?: BuildType;
}
