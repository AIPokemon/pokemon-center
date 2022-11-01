/*
 * @Author:  Hata
 * @Date: 2022-10-30 19:25:21
 * @LastEditors: Hata
 * @LastEditTime: 2022-11-01 22:49:20
 * @FilePath: \pokemon-center\common\grpc.js
 * @Description:
 */

const grpc = require("@grpc/grpc-js");

const servers = {};

exports.getServer = function (name = "default") {
  let server = servers[name];
  if (!(name in servers)) {
    server = new grpc.Server();
    servers[name] = server;
  }
  return server;
};

exports.addService = function (server, protoPackage, serviceName, serviceMap) {
  const protoDescriptor = grpc.loadPackageDefinition(protoPackage);
  server.addService(protoDescriptor[serviceName].service, serviceMap);
};

exports.start = function (server, port) {
  server.bindAsync(
    port,
    grpc.ServerCredentials.createInsecure(),
    (err, port) => {
      if (err) {
        throw err;
      } else {
        server.start();
      }
    }
  );
};
