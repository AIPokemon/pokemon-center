/*
 * @Author:  Hata
 * @Date: 2022-10-30 18:55:39
 * @LastEditors: Hata
 * @LastEditTime: 2022-11-01 22:49:08
 * @FilePath: \pokemon-center\common\protoc.js
 * @Description: 
 */
const fs = require("fs");
const path = require("path");
const protoLoader = require("@grpc/proto-loader");
const extend = require('node.extend');

const defaultOptions = {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
};

exports.getProtoPaths = function (packagePath) {
  const protoFiles = [];
  const files = fs.readdirSync(packagePath);

  files.forEach((val, idx, arr) => {
    if (path.extname(val) === ".proto") {
      protoFiles.push(path.join(packagePath, val));
    }
  });

  return protoFiles;
};

exports.loadPachage = function (packagePath, options = defaultOptions) {
  const protoFiles = exports.getProtoPaths(packagePath);
  const packageDefinition = protoLoader.loadSync(protoFiles, options);
  return packageDefinition;
};

exports.defaultOptions = function () {
  return extend({}, defaultOptions);
};
