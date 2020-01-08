'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const core = require('./core-be2a5dd1.js');

const defineCustomElements = (win, options) => {
  return core.patchEsm().then(() => {
    core.bootstrapLazy([["df-navbar.cjs",[[1,"df-navbar"]]],["my-component.cjs",[[1,"my-component",{"first":[1],"middle":[1],"last":[1]}]]]], options);
  });
};

exports.defineCustomElements = defineCustomElements;
