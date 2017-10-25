
exports.up = function(knex, Promise) {
  return knex.schema.createTable("users", function(table){
    table.increments("id").primary();
    table.string("username").notNullable().unique().defaultTo("");
    table.specificType("hashed_password", "char(60)").notNullable();
    table.timestamps(true, true);
  })

};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists("users");
};
