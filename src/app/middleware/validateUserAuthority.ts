import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import AppError from '../../errors/AppError';
import { getUserByIdGrpc } from '../../grpc-clients/identityClient';

const validateUserAuthority =
     (...roles: string[]) =>
     async (req: Request, res: Response, next: NextFunction) => {
          try {
               //    const tokenWithBearer = req.headers.authorization;
               const stringyfiedUser = req.headers['x-user-id'] as string;
               if (!stringyfiedUser) {
                    throw new AppError(StatusCodes.UNAUTHORIZED, 'You are not authorized !!');
               }
               const parsedUser = JSON.parse(stringyfiedUser);
               const user = await getUserByIdGrpc(parsedUser.id);
               console.log("🚀 ~ validateUserAuthority ~ user:", user)
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
               if (roles.length && !roles.includes(user?.role)) {
                    throw new AppError(StatusCodes.FORBIDDEN, "You don't have permission to access this api !*-!");
               }

               //set user to header
               req.user = user;
               next();
          } catch (error) {
               next(error);
          }
     };

export default validateUserAuthority;
