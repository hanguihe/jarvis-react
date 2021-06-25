import fs from 'fs-extra';
import { join } from 'path';
import ora from 'ora';
import webpack from 'webpack';
import getWebpackConfig from './webpack/config';
import { convertTime } from './util/function';
process.env.NODE_ENV = 'production';
function build() {
    const cwd = process.cwd();
    const publicPath = join(cwd, 'public');
    const outPath = join(cwd, 'dist');
    const spinner = ora();
    spinner.start('clean dist directory');
    fs.emptydirSync(outPath);
    spinner.succeed();
    spinner.start('copy public files');
    fs.copySync(publicPath, outPath, {
        dereference: true,
        filter: (file) => !file.includes('index.html'),
    });
    spinner.succeed();
    spinner.start('start to compile with webpack ...');
    const compiler = webpack(getWebpackConfig('production'));
    compiler.run((err, stats) => {
        if (err) {
            spinner.stop();
            throw err;
        }
        const info = stats?.toJson() || {};
        if (Array.isArray(info.errors) && info.errors.length > 0) {
            spinner.fail('fail to compile..');
            info.errors.forEach((item) => {
                console.error(item.moduleName);
                console.error(item.message);
            });
            process.exit(1);
        }
        if (Array.isArray(info.warnings) && info.warnings.length > 0) {
            info.warnings.forEach((item) => {
                console.warn(item.moduleName);
                console.warn(item.message);
            });
        }
        spinner.succeed(`compile success in ${convertTime(info.time || 0)}`);
        // TODO show file size
    });
}
module.exports = build;
