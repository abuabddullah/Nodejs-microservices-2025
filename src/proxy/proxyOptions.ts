import { NextFunction, Response } from 'express';
import { logger } from '../shared/logger';

export const proxyOptions = {
     proxyErrorHandler: function (err: any, res: Response, next: NextFunction) {
          logger.error(`Proxy error: ${err.message}`);
          res.status(500).json({
               message: 'Internal server error',
               error: err.message,
          });
     },
     userResDecorator: (proxyRes: any, proxyResData: any, userReq: any, userRes: any) => {
          logger.info(`Response received from Identity service: ${proxyRes.statusCode}`);

          return proxyResData;
     },
};
