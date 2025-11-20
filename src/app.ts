import cors from 'cors';
import express, { Application, NextFunction, Request, Response } from 'express';
import session from 'express-session';
import path from 'path';
import { RateLimiterRedis } from 'rate-limiter-flexible';
import { notFound } from './app/middleware/notFound';
import config from './config';
// import passport from './config/passport';
import globalErrorHandler from './globalErrorHandler/globalErrorHandler';
import redisClient from './helpers/redis/redis';
import router from './routes';
import { logger } from './shared/logger';
import { Morgan } from './shared/morgen';
// import setupTimeManagement from './utils/cronJobs';
import { welcome } from './utils/welcome';
import { identityProxy } from './proxy/identity.proxy';

const app: Application = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
//morgan
app.use(Morgan.successHandler);
app.use(Morgan.errorHandler);

//body parser
app.use(
     cors({
          origin: config.allowed_origins || '*',
          credentials: true,
     }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//DDos protection and rate limiting
const rateLimiter = new RateLimiterRedis({
     storeClient: redisClient,
     keyPrefix: 'middleware',
     points: 10,
     duration: 1,
});

app.use((req, res, next) => {
     const ip = req.ip ?? req.headers['x-forwarded-for']?.toString() ?? 'unknown-ip';
     rateLimiter
          .consume(ip)
          .then(() => next())
          .catch(() => {
               logger.warn(`Rate limit exceeded for IP: ${ip}`);
               res.status(429).json({ success: false, message: 'Too many requests' });
          });
});

// Session configuration for OAuth
app.use(
     session({
          secret: config.express_session as string,
          resave: false,
          saveUninitialized: false,
          cookie: {
               secure: config.node_env === 'production',
               httpOnly: true,
               maxAge: 24 * 60 * 60 * 1000, // 24 hours
          },
     }),
);

// // Initialize Passport
// app.use(passport.initialize());
// app.use(passport.session());

//file retrieve
app.use(express.static('uploads'));
app.use(express.static('public'));

//router
app.use('/api/v1/gate-way', router);
//live response
app.get('/', (req: Request, res: Response) => {
     res.send(welcome());
});

// microservice linking with proxy
// Identity Service Route
app.use('/api/v1/identity', identityProxy);

//global error handle
app.use(globalErrorHandler);

//handle not found route;
app.use(notFound);
// setupTimeManagement();
export default app;
