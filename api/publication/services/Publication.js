'use strict';

/**
 * Publication.js service
 *
 * @description: A set of functions similar to controller's actions to avoid code duplication.
 */

// Public dependencies.
const _ = require('lodash');

module.exports = {

  /**
   * Promise to fetch all publications.
   *
   * @return {Promise}
   */

  fetchAll: (params) => {
    // Convert `params` object to filters compatible with Mongo.
    const filters = strapi.utils.models.convertParams('publication', params);
    // Select field to populate.
    const populate = Publication.associations
      .filter(ast => ast.autoPopulate !== false)
      .map(ast => ast.alias)
      .join(' ');

    return Publication
      .find()
      .where(filters.where)
      .sort(filters.sort)
      .skip(filters.start)
      .limit(filters.limit)
      .populate(populate);
  },

  /**
   * Promise to fetch a/an publication.
   *
   * @return {Promise}
   */

  fetch: (params) => {
    // Select field to populate.
    const populate = Publication.associations
      .filter(ast => ast.autoPopulate !== false)
      .map(ast => ast.alias)
      .join(' ');

    return Publication
      .findOne(_.pick(params, _.keys(Publication.schema.paths)))
      .populate(populate);
  },

  /**
   * Promise to count publications.
   *
   * @return {Promise}
   */

  count: (params) => {
    // Convert `params` object to filters compatible with Mongo.
    const filters = strapi.utils.models.convertParams('publication', params);

    return Publication
      .count()
      .where(filters.where);
  },

  /**
   * Promise to add a/an publication.
   *
   * @return {Promise}
   */

  add: async (values) => {
    // Extract values related to relational data.
    const relations = _.pick(values, Publication.associations.map(ast => ast.alias));
    const data = _.omit(values, Publication.associations.map(ast => ast.alias));

    // Create entry with no-relational data.
    const entry = await Publication.create(data);

    // Create relational data and return the entry.
    return Publication.updateRelations({ _id: entry.id, values: relations });
  },

  /**
   * Promise to edit a/an publication.
   *
   * @return {Promise}
   */

  edit: async (params, values) => {
    // Extract values related to relational data.
    const relations = _.pick(values, Publication.associations.map(a => a.alias));
    const data = _.omit(values, Publication.associations.map(a => a.alias));

    // Update entry with no-relational data.
    const entry = await Publication.update(params, data, { multi: true });

    // Update relational data and return the entry.
    return Publication.updateRelations(Object.assign(params, { values: relations }));
  },

  /**
   * Promise to remove a/an publication.
   *
   * @return {Promise}
   */

  remove: async params => {
    // Select field to populate.
    const populate = Publication.associations
      .filter(ast => ast.autoPopulate !== false)
      .map(ast => ast.alias)
      .join(' ');

    // Note: To get the full response of Mongo, use the `remove()` method
    // or add spent the parameter `{ passRawResult: true }` as second argument.
    const data = await Publication
      .findOneAndRemove(params, {})
      .populate(populate);

    if (!data) {
      return data;
    }

    await Promise.all(
      Publication.associations.map(async association => {
        const search = _.endsWith(association.nature, 'One') || association.nature === 'oneToMany' ? { [association.via]: data._id } : { [association.via]: { $in: [data._id] } };
        const update = _.endsWith(association.nature, 'One') || association.nature === 'oneToMany' ? { [association.via]: null } : { $pull: { [association.via]: data._id } };

        // Retrieve model.
        const model = association.plugin ?
          strapi.plugins[association.plugin].models[association.model || association.collection] :
          strapi.models[association.model || association.collection];

        return model.update(search, update, { multi: true });
      })
    );

    return data;
  },

  /**
   * Promise to search a/an publication.
   *
   * @return {Promise}
   */

  search: async (params) => {
    // Convert `params` object to filters compatible with Mongo.
    const filters = strapi.utils.models.convertParams('publication', params);
    // Select field to populate.
    const populate = Publication.associations
      .filter(ast => ast.autoPopulate !== false)
      .map(ast => ast.alias)
      .join(' ');

    const $or = Object.keys(Publication.attributes).reduce((acc, curr) => {
      switch (Publication.attributes[curr].type) {
        case 'integer':
        case 'float':
        case 'decimal':
          if (!_.isNaN(_.toNumber(params._q))) {
            return acc.concat({ [curr]: params._q });
          }

          return acc;
        case 'string':
        case 'text':
        case 'password':
          return acc.concat({ [curr]: { $regex: params._q, $options: 'i' } });
        case 'boolean':
          if (params._q === 'true' || params._q === 'false') {
            return acc.concat({ [curr]: params._q === 'true' });
          }

          return acc;
        default:
          return acc;
      }
    }, []);

    return Publication
      .find({ $or })
      .sort(filters.sort)
      .skip(filters.start)
      .limit(filters.limit)
      .populate(populate);
  }
};
