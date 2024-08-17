const knex = require('knex');
class BaseModel {
    static config
  static async getAll() {
    const query = knex(this.config)
    return await query.select('*').from(this.table)
  }
}
module.exports=BaseModel
