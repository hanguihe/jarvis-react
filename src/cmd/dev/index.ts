import webpack from 'webpack';
import DevServer, { Configuration } from 'webpack-dev-server';
import config from '../../webpack/config';
import devServer from '../../webpack/devServer.json';

process.env.NODE_ENV = 'development';

const compiler = webpack(config());
const { port } = devServer;

const server = new DevServer(compiler, devServer as Configuration);

server.listen(port, 'localhost');
