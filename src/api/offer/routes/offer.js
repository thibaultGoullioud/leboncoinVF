"use strict";

/**
 * offer router
 */

const { createCoreRouter } = require("@strapi/strapi").factories;

module.exports = createCoreRouter("api::offer.offer", {
  config: {
    update: {
      policies: ["api::offer.is-authorized"],
    },
    delete: {
      policies: ["api::offer.is-authorized"],
    },
    create: {
      policies: ["api::offer.is-authorized"],
    },
  },
});
