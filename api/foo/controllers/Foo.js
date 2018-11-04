'use strict';

/**
 * Foo.js controller
 *
 * @description: A set of functions called "actions" for managing `Foo`.
 */

module.exports = {

  /**
   * Retrieve foo records.
   *
   * @return {Object|Array}
   */

  find: async (ctx) => {
    if (ctx.query._q) {
      return strapi.services.foo.search(ctx.query);
    } else {
      return strapi.services.foo.fetchAll(ctx.query);
    }
  },

  /**
   * Retrieve a foo record.
   *
   * @return {Object}
   */

  findOne: async (ctx) => {
    if (!ctx.params._id.match(/^[0-9a-fA-F]{24}$/)) {
      return ctx.notFound();
    }

    return strapi.services.foo.fetch(ctx.params);
  },

  /**
   * Count foo records.
   *
   * @return {Number}
   */

  count: async (ctx) => {
    return strapi.services.foo.count(ctx.query);
  },

  /**
   * Create a/an foo record.
   *
   * @return {Object}
   */

  create: async (ctx) => {
    return strapi.services.foo.add(ctx.request.body);
  },

  /**
   * Update a/an foo record.
   *
   * @return {Object}
   */

  update: async (ctx, next) => {
    return strapi.services.foo.edit(ctx.params, ctx.request.body) ;
  },

  /**
   * Destroy a/an foo record.
   *
   * @return {Object}
   */

  destroy: async (ctx, next) => {
    return strapi.services.foo.remove(ctx.params);
  }
};
