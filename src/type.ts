export interface UserConfig {
  mode?: 'app' | 'component';
  outDir?: string;
}

export interface BuildOptions extends UserConfig {
  cwd: string;
}
