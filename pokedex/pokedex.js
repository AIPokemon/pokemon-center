/*
 * @Author:  Hata
 * @Date: 2022-10-30 18:31:59
 * @LastEditors: Hata
 * @LastEditTime: 2022-11-02 23:01:47
 * @FilePath: \pokemon-center\pokedex\pokedex.js
 * @Description:
 */

const errors = require("./errors");
const { Pokedex } = require("../../pokemon-showdown/.data-dist/pokedex");
const { Abilities } = require("../../pokemon-showdown/.data-dist/abilities");

const convertIgnore = [
  "\\s",
  "%",
  "-",
  ":",
  "\\.",
  ",",
  "’",
  "\\(",
  "\\)",
  "'",
];

const ignoreRegExp = (() => {
  const exp = convertIgnore.join("+|") + "+";
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
      console.log(`try get ${name}, real get.`);
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
    (ability) => getAbilityByName(ability).id
  );

  const types = buildProperty({}, pm.types, { 0: "first", 1: "second" });

  let result = {
    id: id,
    num: pm.num,
    name: pm.name,
    baseStats: pm.baseStats,
    types: types,
    abilities: abilities,
    height: Math.floor(pm.heightm * 100),
    weight: Math.floor(pm.weightkg * 100),
  };

  result = buildProperty(
    result,
    pm,
    { prevo: "prevoId" },
    (prevoName) => getPokemonByName(prevoName).id
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
      console.log(`try get ${name}, real get.`);
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

function getPokemonByNum(num) {
  for (const id in Pokedex) {
    const pokemon = Pokedex[id];
    if (pokemon.num === num) {
      return parsePokemon(id, pokemon);
    }
  }
  throw new errors.DexPokemonError({ num: num });
}

const fliterTable = {
  name: (pm, name) => pm.name.includes(name),
  num: (pm, num) => pm.num === num,
  types: (pm, types) => {
    if (types.first !== undefined && !pm.types.includes(types.first)) {
      return false;
    }
    if (types.second !== undefined && !pm.types.includes(types.second)) {
      return false;
    }
    return true;
  },
  abilities: (pm, abilities) => {
    for (const ability of pm.abilities) {
      if (ability === abilities[0] ?? undefined) {
        return true;
      }
      if (ability === abilities[1] ?? undefined) {
        return true;
      }
      if (ability === abilities["H"] ?? undefined) {
        return true;
      }
    }
    return false;
  },
};

function listPokemonFliter(pm, query) {
  for (let condition in query) {
    const val = query[condition];
    if (val == undefined) {
      continue;
    }

    if (condition in fliterTable) {
      const callback = fliterTable[condition];
      if (!callback(pm, val)) {
        return false;
      }
    }
  }

  return true;
}

function listPokemon(query) {
  const result = [];
  for (const id in Pokedex) {
    const pm = Pokedex[id];
    if (listPokemonFliter(pm, query)) {
      result.push(parsePokemon(id, pm));
    }
  }
  return result;
}

module.exports.getPokemonByName = getPokemonByName;
module.exports.getPokemonById = getPokemonById;
module.exports.getPokemonByNum = getPokemonByNum;
module.exports.listPokemon = listPokemon;
