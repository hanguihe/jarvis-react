import { resolveProjectFile } from '../util/function';
export default function () {
    return {
        allowedHosts: [],
        compress: true,
        clientLogLevel: 'debug',
        contentBase: resolveProjectFile('dist'),
        watchContentBase: true,
        hot: true,
        hotOnly: false,
        noInfo: true,
        port: 3000,
    };
}
