exports.up = function(knex) {
    return knex.schema.createTable('receipt', (table) =>{

        table.increments().primary();
        table.integer('order_number').notNullable();
        table.integer('quantity').notNullable();
        table.double('summary').notNullable();
        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.timestamp('updated_at').defaultTo(knex.fn.now());
        table.integer('client_id').references('id').inTable('clients').onDelete('CASCADE');
    }).createTable('clothes_receipt', (table) => { //n:n wiele do wielu
        table.increments().primary();
        table.integer('clothes_id').references('id').inTable('clothes').onDelete('CASCADE');
        table.integer('receipt_id').references('id').inTable('receipt').onDelete('CASCADE');

    });
};

exports.down = function(knex) {
    return knex.schema
        .dropTable('receipt')
        .dropTable('clothes_receipt')

};
