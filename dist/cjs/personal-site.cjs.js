'use strict';

const core = require('./core-be2a5dd1.js');

core.patchBrowser().then(options => {
  return core.bootstrapLazy([["df-navbar.cjs",[[1,"df-navbar"]]],["my-component.cjs",[[1,"my-component",{"first":[1],"middle":[1],"last":[1]}]]]], options);
});
