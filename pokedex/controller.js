/*
 * @Author:  Hata
 * @Date: 2022-10-30 22:00:47
 * @LastEditors: Hata
 * @LastEditTime: 2022-11-02 23:20:11
 * @FilePath: \pokemon-center\pokedex\controller.js
 * @Description:
 */

const pokedex = require("./pokedex");

module.exports.getPokemon = (call, callback) => {
  const req = call.request;
  let pm = undefined;
  try {
    if ("id" in req) {
      pm = pokedex.getPokemonById(req.id);
    } else if ("name" in req) {
      pm = pokedex.getPokemonByName(req.name);
    } else if ("num" in req) {
      pm = pokedex.getPokemonByNum(req.num);
    }
  } catch (error) {
    callback(error, { result: pm });
  }

  callback(undefined, { result: pm });
};

module.exports.listPokemon = (call, callback) => {
  let result = undefined;
  try {
    result = pokedex.listPokemon(call.request);
  } catch (error) {
    callback(error, undefined);
  }
  callback(undefined, { result: result });
};
