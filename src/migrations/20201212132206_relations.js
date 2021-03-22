
exports.up = function(knex) {
    return knex.schema.createTable('collections', (table) =>{ //1:n jeden do wielu
        table.increments().primary();
        table.string('name').notNullable();
        table.string('description').notNullable();
        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.timestamp('updated_at').defaultTo(knex.fn.now());
        table.integer('clothes_id').references('id').inTable('clothes').onDelete('CASCADE');
    }).createTable('producers_clothes', (table) => { //n:n wiele do wielu
        table.increments().primary();
        table.integer('producers_id').references('id').inTable('producers').onDelete('CASCADE');
        table.integer('clothes_id').references('id').inTable('clothes').onDelete('CASCADE');
    });
  
};

exports.down = function(knex) {
    return knex.schema
        .dropTable('collections')
        .dropTable('producers_clothes')
};
