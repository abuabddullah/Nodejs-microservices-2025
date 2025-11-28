Below is a **concrete, reusable pattern** you can apply to your current project (Post + Identity services) and later **copy‑paste to any new microservice**.

I’ll structure it as:

1. Overall architecture for large systems
2. Folder structure you can follow
3. Shared `.proto` package (copy‑pasteable)
4. Identity Service: gRPC server wrapper
5. Post Service: gRPC client wrapper
6. How to reuse in future projects

---

## 1. Architecture pattern (for large systems)

- **Do NOT wire gRPC directly inside controllers.**  
  Create:

  - **Shared proto package**: all `.proto` definitions live here.
  - **Service-specific gRPC server module**: starts server, implements handlers.
  - **Client libraries**: small reusable NPM-style packages like `identity-grpc-client`.

- In each HTTP/Kafka service:
  - Controllers/services only talk to **client abstractions** (e.g. `IdentityClient.getUserById`).
  - They never import `@grpc/grpc-js` directly.

This keeps the system modular and easy to copy.

---

## 2. Suggested folder structure

In your mono‑repo:

```text
microservice/
  protos/
    identity/
      identity.proto

  Nodejs-microservices-2025-identity-service/
    src/
      grpc/
        server.ts
        identity.handlers.ts
      ...

  Nodejs-microservices-2025-post-service/
    src/
      grpc-clients/
        identityClient.ts
      app/
        modules/
          post/
            post.service.ts
      ...
```

For **reuse across repos**, you can later move `protos/` and `grpc-clients/` into separate npm packages.

---

## 3. Shared proto (copy‑pasteable base)

`/protos/identity/identity.proto`:

```proto
syntax = "proto3";

package identity.v1;


service IdentityService {
  rpc GetUserById (GetUserByIdRequest) returns (GetUserByIdResponse);
}


message GetUserByIdRequest {
  string userId = 1;
}


message User {
  string _id = 1;
  string email = 2;
  string name = 3;
  string role = 4;
  string status = 5;
  bool isDeleted = 6;
}


message GetUserByIdResponse {
  User user = 1;
}
```

- Versioned package (`identity.v1`) helps for future upgrades.
- Any service needing user info uses this same proto.

---

## 4. Identity Service: gRPC server wrapper

Install once (in Identity service):

```bash
npm install @grpc/grpc-js @grpc/proto-loader
```


### `identity-service/.env`

```bash
************
*********
*******
IDENTITY_GRPC_BIND=192.168.10.133:50051
```


### `identity-service/src/config/index.ts`

```bash
*******************
**********************
     grpc: {
          identity_grpc_bind: process.env.IDENTITY_GRPC_BIND,
     },
```

### `src/grpc/identity.handlers.ts`

Responsible **only** for mapping gRPC calls to your existing user logic:

```ts
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

```

### `src/grpc/server.ts`

Generic server bootstrap you can reuse for any service:

```ts
import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import path from 'path';
import { IdentityHandlers } from './identity.handlers';
import config from '../config';
import { logger } from '../shared/logger';
import colors from 'colors';

const PROTO_PATH = path.join(__dirname, '../../../protos/identity/identity.proto');

export async function startIdentityGrpcServer() {
     const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
          keepCase: false,
          longs: String,
          enums: String,
          defaults: true,
          oneofs: true,
     });

     const pkg = grpc.loadPackageDefinition(packageDefinition) as any;
     const identityProto = pkg.identity.v1;

     const server = new grpc.Server();

     server.addService(identityProto.IdentityService.service, IdentityHandlers);

     const address = config.grpc.identity_grpc_bind;

     server.bindAsync(address as string, grpc.ServerCredentials.createInsecure(), (err, port) => {
          if (err) {
               console.error('Failed to start gRPC server', err);
               return;
          }
          logger.info(colors.bgYellow(`Identity gRPC server running on ${address} (port ${port})`));
          server.start();
     });
}

```

Then call `startIdentityGrpcServer()` from your main `identity-service/src/server.ts` of Identity.

```bash

*****************************************
*****************************************
*****************************************
*****************************************
import { startIdentityGrpcServer } from './grpc/server';

*****************************************
*****************************************

// Function to start the server
export async function startServer() {
     try {
*****************************************
*****************************************
*****************************************
*****************************************
*****************************************
          // Start gRPC server as well
          await startIdentityGrpcServer();
     } catch (error) {
          logger.error(colors.red('Failed to start server'), error);
          process.exit(1);
     }
}

*****************************************
*****************************************

```

**This entire `grpc` folder is copy‑pasteable** to any future service: just change the proto path and handlers.

---

## 5. Post Service: reusable gRPC client wrapper

Install libs in Post service as well:

```bash
npm install @grpc/grpc-js @grpc/proto-loader
```

### `post-service/.env`

```bash
*********
***************
# # grpc ⬇️⬇️
IDENTITY_GRPC_URL=192.168.10.133:50051
```

### `post-service/src/config/index.ts`

```bash
****************
*******************
     grpc: {
          identity_grpc_url: process.env.IDENTITY_GRPC_URL,
     },
```

### `src/grpc-clients/identityClient.ts`

Reusable client that **any project** can copy:

```ts
import * as grpc from "@grpc/grpc-js";
import * as protoLoader from "@grpc/proto-loader";
import path from "path";
import config from "../config";

const PROTO_PATH = path.join(
  __dirname,
  "../../../protos/identity/identity.proto"
);


type TGetUserByIdRequest = { userId: string };
export type TUser = { _id: string; email: string; name: string; role: string; status: string; isDeleted: boolean };


let identityClient: any;


function getClient() {
  if (identityClient) return identityClient;


  const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
    keepCase: false,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
  });


  const pkg = (grpc.loadPackageDefinition(packageDefinition) as any).identity
    .v1;


  const target = config.grpc.identity_grpc_url;


  identityClient = new pkg.IdentityService(
    target,
    grpc.credentials.createInsecure()
  );


  return identityClient;
}


export async function getUserByIdGrpc(userId: string): Promise<TUser> {
  console.log("🚀 ~ getUserByIdGrpc ~ userId:", userId)
  const client = getClient();


  const deadline = new Date(Date.now() + 2000); // 2s timeout


  return new Promise<TUser>((resolve, reject) => {
    client.GetUserById(
      { userId } as TGetUserByIdRequest,
      { deadline },
      (err: any, response: { user: TUser }) => {
        if (err) {
          return reject(err);
        }
        resolve(response.user);
      }
    );
  });
}
```

### Use inside Post service code

Example in `post-service/src/app/middleware/validateUserAuthority.ts`:

```ts
*********************
********************
**********************
import { getUserByIdGrpc } from '../../grpc-clients/identityClient';

const validateUserAuthority =
     (...roles: string[]) =>
     async (req: Request, res: Response, next: NextFunction) => {
          try {
               ****************************
               ****************************
               ****************************
               ****************************
               const parsedUser = JSON.parse(stringyfiedUser);
               const user = await getUserByIdGrpc(parsedUser.id);
               console.log("🚀 ~ validateUserAuthority ~ user:", user)
               ****************************
               ****************************
               ****************************
               ****************************
          } catch (error) {
               next(error);
          }
     };

export default validateUserAuthority;

```

**Note:** need to replace `IJWTPayload` with `TUser`.


### `post-service/src/app/modules/post/post.controller.ts`

```bash
*******************************
********************************
*******************************
********************************
import { TUser } from '../../../grpc-clients/identityClient';

const createPost = catchAsync(async (req: Request, res: Response) => {
     const result = await postService.createPost(req.body, req.user as TUser);

     sendResponse(res, {
          statusCode: 200,
          success: true,
          message: 'Post created successfully',
          data: result,
     });
});

*******************************
********************************
*******************************
********************************
*******************************
********************************

```

### `post-service/src/app/modules/post/post.service.ts`

```bash

*******************************
********************************
*******************************
********************************
import { TUser } from '../../../grpc-clients/identityClient';

const createPost = async (payload: Partial<Ipost>, user: TUser): Promise<Ipost> => {
     logger.info('Create post endpoint hit');
     const postDTO = {
          ...payload,
          user: user._id,
     };
     const newCreatedPost = await Post.create(postDTO);
     if (!newCreatedPost) {
          throw new AppError(StatusCodes.NOT_FOUND, 'Post not found.');
     }

     await invalidatePostCache(newCreatedPost._id.toString());
     // /*
     // // publishEvent for rabbitmq later
     // // **********************
     // // ***********
     // // ****************
     // */
     logger.info('Post created successfully', newCreatedPost);
     return newCreatedPost;
};

*******************************
********************************
*******************************
********************************
*******************************
********************************
*******************************
********************************

```
---

## 6. How to make this easily reusable for new projects

When starting any new project:

1. **Copy `protos/`** folder as‑is (or publish as a private npm package in the future).
2. **For a new service that exposes gRPC**:
   - Copy `src/grpc/server.ts` and adapt proto path + handlers file.
   - Copy the handler file and plug your service logic.
3. **For a service that calls Identity**:
   - Copy `src/grpc-clients/identityClient.ts`.
   - Set `IDENTITY_GRPC_URL` in `.env`.
   - Call `getUserByIdGrpc` wherever needed.

If you’d like, next I can:

- Adapt these paths 100% to your actual Identity service repo structure, and
- Show exactly where to call `startIdentityGrpcServer()` and `getUserByIdGrpc()` in your existing `server.ts` / `post.controller.ts`.