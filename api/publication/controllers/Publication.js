'use strict';

/**
 * Publication.js controller
 *
 * @description: A set of functions called "actions" for managing `Publication`.
 */

module.exports = {

  /**
   * Retrieve publication records.
   *
   * @return {Object|Array}
   */

  find: async (ctx) => {
    if (ctx.query._q) {
      return strapi.services.publication.search(ctx.query);
    } else {
      return strapi.services.publication.fetchAll(ctx.query);
    }
  },

  /**
   * Retrieve a publication record.
   *
   * @return {Object}
   */

  findOne: async (ctx) => {
    if (!ctx.params._id.match(/^[0-9a-fA-F]{24}$/)) {
      return ctx.notFound();
    }

    return strapi.services.publication.fetch(ctx.params);
  },

  /**
   * Count publication records.
   *
   * @return {Number}
   */

  count: async (ctx) => {
    return strapi.services.publication.count(ctx.query);
  },

  /**
   * Create a/an publication record.
   *
   * @return {Object}
   */

  create: async (ctx) => {
    return strapi.services.publication.add(ctx.request.body);
  },

  /**
   * Update a/an publication record.
   *
   * @return {Object}
   */

  update: async (ctx, next) => {
    return strapi.services.publication.edit(ctx.params, ctx.request.body) ;
  },

  /**
   * Destroy a/an publication record.
   *
   * @return {Object}
   */

  destroy: async (ctx, next) => {
    return strapi.services.publication.remove(ctx.params);
  }
};
