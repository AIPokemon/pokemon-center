/*
 * @Author:  Hata
 * @Date: 2022-10-30 22:00:47
 * @LastEditors: Hata
 * @LastEditTime: 2022-11-01 23:52:18
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
    }
  } catch (error) {
    callback(error, { result: pm });
  }

  callback(undefined, { result: pm });
};
