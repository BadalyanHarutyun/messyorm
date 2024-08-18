const knex = require('knex');
class BaseModel {
  static config;
  static columns;
  static select;
  static checkConfig() {
    if (!this.config) {
      throw new Error('messyorm need config (it is same as knex config)');
    }
  }
  static async getAll(options) {
    this.checkConfig();
    let query = knex(this.config);
    let queryBuilder = query(this.table);
    if (!this.columns) {
      return await options?.limit? queryBuilder.select('*').limit(options.limit):queryBuilder.select('*');
    }
    if (!this.select) {
      for (const item of this.columns) {
        queryBuilder.select(item);
      }
      return   await options?.limit? queryBuilder.limit(options.limit):queryBuilder;
    }
  }
}
module.exports = BaseModel;
