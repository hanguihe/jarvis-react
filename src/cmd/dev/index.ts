import webpack from 'webpack';
import DevServer, { Configuration } from 'webpack-dev-server';
import Config from '../../webpack/config';
import devServer from './devServer.json';

process.env.NODE_ENV = 'development';

const compiler = webpack(Config('development'));
const { port } = devServer;

const server = new DevServer(compiler, devServer as Configuration);

server.listen(port, 'localhost');
