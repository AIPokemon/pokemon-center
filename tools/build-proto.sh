#!/bin/bash
###
 # @Author:  Hata
 # @Date: 2022-10-30 22:43:23
 # @LastEditors: Hata
 # @LastEditTime: 2022-10-30 23:17:55
 # @FilePath: \pokemon-center\tools\build-proto.sh
 # @Description: 
### 

gen_js_path="node_modules/@grpc/proto-loader/build/bin/proto-loader-gen-types.js"
proto_path="../pokemon-rpc/pokedex"

protos=$(ls ${proto_path}/*.proto)

for proto in $protos; do
    echo $proto
    $gen_js_path --longs=String --enums=String --defaults --oneofs --grpcLib=@grpc/grpc-js --outDir=proto/ --includeDirs "$proto_path/../" -- $proto
done