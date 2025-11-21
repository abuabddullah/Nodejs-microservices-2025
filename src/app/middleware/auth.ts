import axios from 'axios';
import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { Secret } from 'jsonwebtoken';
import config from '../../config';
import AppError from '../../errors/AppError';
import { verifyToken } from '../../utils/verifyToken';

const auth =
     (...roles: string[]) =>
     async (req: Request, res: Response, next: NextFunction) => {
          try {
               //    const tokenWithBearer = req.headers.authorization;
               const tokenWithBearer = req.headers['x-user-id'] as string;
               if (!tokenWithBearer) {
                    throw new AppError(StatusCodes.UNAUTHORIZED, 'You are not authorized !!');
               }
               if (!tokenWithBearer.startsWith('Bearer')) {
                    throw new AppError(StatusCodes.UNAUTHORIZED, 'Token send is not valid !!');
               }

               if (tokenWithBearer && tokenWithBearer.startsWith('Bearer')) {
                    const token = tokenWithBearer.split(' ')[1];

                    //verify token
                    let verifyUser: any;
                    try {
                         verifyUser = verifyToken(token, config.jwt.jwt_secret as Secret);
                    } catch (error) {
                         throw new AppError(StatusCodes.UNAUTHORIZED, 'You are not authorized !!');
                    }

                    // user check: isUserExist or not
                    let user;
                    try {
                         const response = await axios.get(`${config.microservices.apigateway_service_url}/api/v1/identity/user/find/id/${verifyUser.id}`, {
                              headers: {
                                   'Authorization': `Bearer ${token}`,
                                   'Content-Type': 'application/json',
                              },
                              timeout: 10000,
                         });

                         // Assuming the identity service returns the user object when found
                         user = response.data?.result || response.data; // adjust according to actual response shape
                    } catch (error: any) {
                         // Handle 404 from identity service
                         if (error.response?.response?.status === 404) {
                              throw new AppError(StatusCodes.NOT_FOUND, 'This user is not found !!');
                         }

                         // Handle network errors, timeouts, 5xx, etc.
                         console.error('Error while checking user existence in identity service:', error.message);
                         throw new AppError(StatusCodes.INTERNAL_SERVER_ERROR, 'Unable to verify user existence at the moment.');
                    }
                    if (!user) {
                         throw new AppError(StatusCodes.NOT_FOUND, 'This user is not found !!');
                    }

                    if (user?.status === 'blocked') {
                         throw new AppError(StatusCodes.FORBIDDEN, 'This user is blocked !!');
                    }

                    if (user?.isDeleted) {
                         throw new AppError(StatusCodes.FORBIDDEN, 'This user accaunt is deleted !!');
                    }

                    //guard user
                    if (roles.length && !roles.includes(verifyUser?.role)) {
                         throw new AppError(StatusCodes.FORBIDDEN, "You don't have permission to access this api !*-!");
                    }

                    //set user to header
                    req.user = verifyUser;
                    next();
               }
          } catch (error) {
               next(error);
          }
     };

export default auth;
