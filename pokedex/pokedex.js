/*
 * @Author:  Hata
 * @Date: 2022-10-30 18:31:59
 * @LastEditors: Hata
 * @LastEditTime: 2022-11-01 23:58:41
 * @FilePath: \pokemon-center\pokedex\pokedex.js
 * @Description:
 */

const errors = require("./errors");
const { Pokedex } = require("../../pokemon-showdown/.data-dist/pokedex");
const { Abilities } = require("../../pokemon-showdown/.data-dist/abilities");

const convertIgnore = ["s", "%", "-"];
const ignoreRegExp = (() => {
  const exp = convertIgnore.join("+|");
  return new RegExp(exp, "g");
})();

function convertName(name) {
  name = name.toLowerCase();
  name = name.replace(ignoreRegExp, "");
  return name;
}

function buildProperty(result, origin, key_mapping, convertFunc = undefined) {
  for (key in origin) {
    const convertKey = key_mapping[key] ?? undefined;
    if (convertKey !== undefined) {
      let val = origin[key];
      if (convertFunc !== undefined) {
        try {
          val = convertFunc(val);
        } catch {}
      }
      result[convertKey] = val;
    }
  }

  return result;
}

function parseAbility(id, ability) {
  return id;
}

function getAbilityById(id) {
  const ability = Abilities[id] ?? undefined;
  if (ability === undefined) {
    throw new errors.DexAbilityError({ id: id });
  }

  return parseAbility(id, ability);
}

function getAbilityByName(name) {
  try {
    const id = convertName(name);
    return getAbilityById(id);
  } catch (err) {
    if (err instanceof errors.DexAbilityError) {
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

  throw new errors.DexAbilityError({ name: name });
}

function parsePokemon(id, pm) {
  const abilities = buildProperty(
    {},
    pm.abilities,
    { 0: "first", 1: "second", H: "hidden" },
    getAbilityByName
  );

  const types = buildProperty({}, pm.types, { 0: "first", 1: "second" });

  let result = {
    id: id,
    num: pm.num,
    name: pm.name,
    baseStats: pm.baseStats,
    types: types,
    abilities: abilities,
    height: pm.heightm,
    weight: pm.weightkg,
  };

  result = buildProperty(
    result,
    pm,
    { prevo: "prevoId" },
    (val) => getPokemonByName(val).id
  );

  return result;
}

function getPokemonById(id) {
  const pokemon = Pokedex[id] ?? undefined;
  if (pokemon === undefined) {
    throw new errors.DexPokemonError({ id: id });
  }

  return parsePokemon(id, pokemon);
}

function getPokemonByName(name) {
  try {
    const id = convertName(name);
    return getPokemonById(id);
  } catch (err) {
    if (err instanceof errors.DexPokemonError) {
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

  throw new errors.DexPokemonError({ name: name });
}

module.exports.getPokemonByName = getPokemonByName;
module.exports.getPokemonById = getPokemonById;
