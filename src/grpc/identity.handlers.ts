import * as grpc from '@grpc/grpc-js';
import { UserService } from '../app/modules/user/user.service';

type TGetUserByIdRequest = { userId: string };
type TUser = { _id: string; email: string; name: string; role: string; status: string; isDeleted: boolean };
type TGetUserByIdResponse = { user: TUser };

export const IdentityHandlers = {
     async GetUserById(call: grpc.ServerUnaryCall<TGetUserByIdRequest, TGetUserByIdResponse>, callback: grpc.sendUnaryData<TGetUserByIdResponse>) {
          try {
               const {userId} = call.request;
               console.log("🚀 ~ GetUserById ~ userId:", userId)

               const user = await UserService.findUserById(userId);
               console.log("🚀 ~ GetUserById ~ user:", user)

               if (!user) {
                    return callback(
                         {
                              code: grpc.status.NOT_FOUND,
                              message: 'User not found',
                         } as any,
                         null,
                    );
               }

               callback(null, { user });
          } catch (err: any) {
               callback(
                    {
                         code: grpc.status.INTERNAL,
                         message: err?.message || 'Internal error',
                    } as any,
                    null,
               );
          }
     },
};
