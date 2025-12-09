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