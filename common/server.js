/*
 * @Author:  Hata
 * @Date: 2022-10-30 20:18:03
 * @LastEditors: Hata
 * @LastEditTime: 2022-11-01 22:16:25
 * @FilePath: \pokemon-center\common\server.js
 * @Description:
 */

const path = require("path");
const config = require("../config.json");
const grpc = require("./grpc");
const protoc = require("./protoc");

function startServer(serverName, serverConfig) {
  const server = grpc.getServer(serverName);
  const inuse = serverConfig.inuse ?? 1;
  if (inuse === 1) {
    grpc.start(server, serverConfig.port);
    return true;
  }

  return false;
}

function loadModule(moduleName, moduleConfig) {
  const rpcServer = moduleConfig.rpcServer;
  const protoFiles = moduleConfig.protoFiles;
  const serviceName = moduleConfig.serviceName;
  const controllerPath = path.join("../", moduleConfig.controller ?? "");

  const server = grpc.getServer(rpcServer);
  const package = protoc.loadPachage(protoFiles);

  let controller = {};

  try {
    controller = require(controllerPath) ?? {};
    console.info("%s: %s", controllerPath, controller);
  } catch (error) {
    console.warn("%s: %s", controllerPath, error.toString());
  }

  grpc.addService(server, package, serviceName, controller);
}

exports.init = function () {
  const modules = config.modules;
  const rpcServers = config.rpcServers;

  for (let module in modules) {
    const conf = modules[module];
    loadModule(module, conf);
    console.log("Loaded module (%s).", module);
  }

  for (let server in rpcServers) {
    const conf = rpcServers[server];
    if (startServer(server, conf)) {
      console.log("Started server (%s).", server);
    }
  }
};
