/*
 * @Author:  Hata
 * @Date: 2022-10-31 22:12:35
 * @LastEditors: Hata
 * @LastEditTime: 2022-11-02 15:54:37
 * @FilePath: \pokemon-center\pokedex\errors.js
 * @Description:
 */

class DexResourceError extends Error {
  constructor(resource, query) {
    const queryStr = JSON.stringify(query);
    super(
      `get resoure from pokedex error! resource:( ${resource} ), query:( ${queryStr} )`
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
