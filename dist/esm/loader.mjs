import { a as patchEsm, b as bootstrapLazy } from './core-5f07362e.js';

const defineCustomElements = (win, options) => {
  return patchEsm().then(() => {
    bootstrapLazy([["df-navbar",[[1,"df-navbar"]]],["my-component",[[1,"my-component",{"first":[1],"middle":[1],"last":[1]}]]]], options);
  });
};

export { defineCustomElements };
