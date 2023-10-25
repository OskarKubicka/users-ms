// import * as dotenv from "dotenv";
// dotenv.config();
// import * as express from "express";
// import helmet from 'helmet';
// import * as cors from 'cors';
// import * as compression from 'compression';
require('dotenv').config();
import config from './config';
import { logger } from './libs/logger';
import {server} from './initializers/express'

// const app = express()
// const http = require('http');
//const logger = require('./libs/logger');

// const name = process.env.NAME;
// const hostname = process.env.NODE_HOSTNAME;
// const port = process.env.NODE_PORT;

// app.use(helmet());
// app.options('*', cors({ credentials: true, origin: true }));
// app.use(cors());
// app.use(compression());
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// app.get('/', (req, res) => {
//     logger.info(`[Express] path: ${req.path}, req: ${req.method}, ip: ${req.ip}`)
//     res.end('hello world')
// });

// app.listen(port, hostname, () => {
//     logger.info(`server running at http://${hostname}:${port}/`)
// })

try {
    logger.info(`[${config.APP_NAME}] Bootstrapping micro service`);
    server({ hostname: config.NODE_HOSTNAME, port: config.NODE_PORT });
} catch (error) {
    logger.error(`[${name}] Caught exception: ${error}`)
}