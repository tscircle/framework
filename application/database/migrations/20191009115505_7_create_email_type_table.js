exports.up = function(knex, Promise) {
    return knex.schema.createTable('email_type', function (t) {
        t.increments('id').unsigned().primary();

        t.string('name').notNullable();

        t.boolean('extendable').defaultTo(false);

        t.timestamps(false, true);
    });
};


exports.down = function(knex, Promise) {
    return knex.schema.dropTable('email_type');
};

