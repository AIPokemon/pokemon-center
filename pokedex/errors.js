/*
 * @Author:  Hata
 * @Date: 2022-10-31 22:12:35
 * @LastEditors: Hata
 * @LastEditTime: 2022-11-01 23:56:41
 * @FilePath: \pokemon-center\pokedex\errors.js
 * @Description:
 */

class DexResourceError extends Error {
  constructor(resource, query) {
    super(
      `get resoure from pokedex error! resource:( ${resource} ), query:( ${JSON.stringify(query)} )`
    );
  }
}

class DexAbilityError extends DexResourceError {
  constructor(query) {
    super("ability", query);
  }
}

class DexPokemonError extends DexResourceError {
    constructor(query) {
      super("pokemon", query);
    }
  }

module.exports.DexResourceError = DexResourceError;
module.exports.DexAbilityError = DexAbilityError;
module.exports.DexPokemonError = DexPokemonError;
