import ora from 'ora';
import webpack from 'webpack';
import Server from 'webpack-dev-server';
import getWebpackConfig from './webpack/config';
import getServerConfig from './webpack/devServer';
process.env.NODE_ENV = 'development';
function dev() {
    const spinner = ora();
    const config = getServerConfig();
    const compiler = webpack(getWebpackConfig('development'));
    compiler.hooks.invalid.tap('invalid', () => {
        spinner.start('compiling...');
    });
    compiler.hooks.done.tap('done', (stats) => {
        const info = stats.toJson({ all: false, errors: true, warnings: true });
        if (Array.isArray(info.errors) && info.errors.length > 0) {
            spinner.fail('fail to compile');
            info.errors.forEach((item) => {
                console.error(item.moduleName);
                console.error(item.message);
            });
            process.exit(1);
        }
        if (Array.isArray(info.warnings) && info.warnings.length > 0) {
            console.warn('compile with warnings..');
            info.warnings.forEach((item) => {
                console.error(item.moduleName);
                console.error(item.message);
            });
        }
        spinner.succeed('success to compile \n');
    });
    // @ts-ignore
    const server = new Server(compiler, config);
    server.listen(config.port || 3000, config.host || 'localhost', (err) => {
        if (err) {
            spinner.fail('compile with errors');
            throw err;
        }
        spinner.start('start development server..');
    });
}
module.exports = dev;
