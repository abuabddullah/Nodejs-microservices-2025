import proxy from 'express-http-proxy';
import config from '../config';
import { proxyOptions } from './proxyOptions';

export const identityProxy = proxy(config.microservices.identity_service_url as string, {
     ...proxyOptions,
     proxyReqPathResolver: (req) => {
          return req.originalUrl.replace('/api/v1/identity', '/api/v1/identity');
     },
     proxyReqOptDecorator: (proxyReqOpts, srcReq) => {
          proxyReqOpts.headers['Content-Type'] = 'application/json';
          return proxyReqOpts;
     },
});
