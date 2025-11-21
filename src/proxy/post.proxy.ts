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
          // proxyReqOpts.headers['x-user-id'] = srcReq.user.id;
          proxyReqOpts.headers['x-user-id'] = srcReq.headers.authorization;
          return proxyReqOpts;
     },
});
