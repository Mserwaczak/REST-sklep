
exports.up = function(knex) {
  return knex.schema.createTable('clothes', (table)=>{
      table.increments().primary();
      table.string('brand').notNullable();
      table.string('category').notNullable();
      table.string('size').notNullable();
      table.double("price").notNullable();
      table.timestamp('created_at').defaultTo(knex.fn.now());
      table.timestamp('updated_at').defaultTo(knex.fn.now());
  })
};

exports.down = function(knex) {
  return knex.schema.dropTable('clothes');
};
