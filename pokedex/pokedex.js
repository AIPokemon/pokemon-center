/*
 * @Author:  Hata
 * @Date: 2022-10-30 18:31:59
 * @LastEditors: Hata
 * @LastEditTime: 2022-10-31 23:43:20
 * @FilePath: \pokemon-center\pokedex\pokedex.js
 * @Description:
 */

const errors = require("./errors");
const { Pokedex } = require("../../pokemon-showdown/.data-dist/pokedex");
const { Abilities } = require("../../pokemon-showdown/.data-dist/abilities");

function convertName(name) {
  name = name.toLowerCase();
  name = name.replace(/(\s*)/g, "");
  return name;
}

function buildProperty(base, table, convertFunc = undefined) {
  const result = {};
  for (key in base) {
    const convertKey = table[key] ?? undefined;
    if (convertKey !== undefined) {
      let val = base[key];
      if (convertFunc !== undefined) {
        val = convertFunc(val);
      }
      result[convertKey] = val;
    }
  }

  return result;
}

function parseAbility(id, ability) {
  const result = {
    id: id,
    num: ability.num,
    name: ability.name,
    rating: ability.rating,
  };

  return result;
}

function getAbilityById(id) {
  const ability = Abilities[id] ?? undefined;
  if (ability === undefined) {
    throw new errors.DexResourceError("ability", { id: id });
  }

  return parseAbility(id, ability);
}

function getAbilityByName(name) {
  try {
    const id = convertName(name);
    return getAbilityById(id);
  } catch (err) {
    if (err instanceof errors.DexResourceError) {
      for (const id in Abilities) {
        const ability = Abilities[id];
        if (ability.name === name) {
          return parseAbility(id, ability);
        }
      }
    } else {
      throw err;
    }
  }

  throw new errors.DexResourceError("ability", { name: name });
}

function parsePokemon(id, pm) {
  const abilities = buildProperty(
    pm.abilities,
    { 0: "first", 1: "second", H: "hidden" },
    getAbilityByName
  );

  const types = buildProperty(pm.types, { 0: "first", 1: "second" });

  const result = {
    id: id,
    num: pm.num,
    name: pm.name,
    baseStats: pm.baseStats,
    types: types,
    abilities: abilities,
    height: pm.heightm,
    weight: pm.weightkg,
  };

  if ("prevo" in pm) {
    result.prevoId = getPokemonByName(pm.prevo).id;
  }

  return result;
}

module.exports.getPokemonById = function getPokemonById(id) {
  const pokemon = Pokedex[id] ?? undefined;
  if (pokemon === undefined) {
    throw new errors.DexResourceError("pokemon", { id: id });
  }

  return parsePokemon(id, pokemon);
};

module.exports.getPokemonByName = function getPokemonByName(name) {
  try {
    const id = convertName(name);
    return getPokemonById(id);
  } catch (err) {
    if (err instanceof errors.DexResourceError) {
      for (const id in Pokedex) {
        const pokemon = Pokedex[id];
        if (pokemon.name === name) {
          return parsePokemon(id, pokemon);
        }
      }
    } else {
      throw err;
    }
  }

  throw new errors.DexResourceError("pokemon", { name: name });
};
