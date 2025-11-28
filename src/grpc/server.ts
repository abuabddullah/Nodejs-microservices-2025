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
