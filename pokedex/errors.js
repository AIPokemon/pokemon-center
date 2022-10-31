/*
 * @Author:  Hata
 * @Date: 2022-10-31 22:12:35
 * @LastEditors: Hata
 * @LastEditTime: 2022-10-31 23:41:33
 * @FilePath: \pokemon-center\pokedex\errors.js
 * @Description:
 */

class DexResourceError extends Error {
  constructor(resource, query) {
    super(`get resoure from pokedex error! resource:(${resource}), query:(${query})`);
  }
}

module.exports.DexResourceError = DexResourceError;