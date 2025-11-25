import proxy from 'express-http-proxy';
import config from '../config';
import { proxyOptions } from './proxyOptions';

export const postProxy = proxy(config.microservices.post_service_url as string, {
     ...proxyOptions,
     proxyReqPathResolver: (req) => {
          return req.originalUrl.replace('/api/v1/post', '/api/v1/post');
     },
     proxyReqOptDecorator: (proxyReqOpts, srcReq) => {
          proxyReqOpts.headers['Content-Type'] = 'application/json';
          proxyReqOpts.headers['x-user-id'] = JSON.stringify(srcReq.user);
          return proxyReqOpts;
     },
});
