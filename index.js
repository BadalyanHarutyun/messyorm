const knex = require('knex');
class BaseModel {
    static config
  static async getAll() {
    const query = knex(cofig)
    return await query.select('*').from(this.table)
  }
}
exports.module=BaseModel
