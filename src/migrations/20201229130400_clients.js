exports.up = function(knex) {
    return knex.schema.createTable('clients', (table) =>{

        table.increments().primary();
        table.string('login').notNullable();
        table.string('password').notNullable();
        table.string('name').notNullable();
        table.string('surname').notNullable();
        table.string('email').notNullable();
        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.timestamp('updated_at').defaultTo(knex.fn.now());
    });
};

exports.down = function(knex) {
        return knex.schema.dropTable('clients');
};
