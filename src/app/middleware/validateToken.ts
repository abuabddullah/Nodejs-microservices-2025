import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { Secret } from 'jsonwebtoken';
import config from '../../config';
import AppError from '../../errors/AppError';
import { verifyToken } from '../../utils/verifyToken';

const validateToken = () => async (req: Request, res: Response, next: NextFunction) => {
     try {
          const tokenWithBearer = req.headers.authorization;
          if (!tokenWithBearer) {
               //    throw new AppError(StatusCodes.UNAUTHORIZED, 'You are not authorized !api-gateway!**');
               next();
          }
          if (tokenWithBearer && !tokenWithBearer.startsWith('Bearer')) {
               throw new AppError(StatusCodes.UNAUTHORIZED, 'Token send is not valid !api-gateway!');
          }

          if (tokenWithBearer && tokenWithBearer.startsWith('Bearer')) {
               const token = tokenWithBearer.split(' ')[1];

               //verify token
               let verifyUser: any;
               try {
                    verifyUser = verifyToken(token, config.jwt.jwt_secret as Secret);
               } catch (error) {
                    throw new AppError(StatusCodes.UNAUTHORIZED, 'You are not authorized !api-gateway!');
               }

               //set user to header
               req.user = verifyUser;
               next();
          }
     } catch (error) {
          next(error);
     }
};

export default validateToken;
