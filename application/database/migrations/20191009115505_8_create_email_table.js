exports.up = function(knex, Promise) {
    return knex.schema.createTable('email', function (t) {
        t.increments('id').unsigned().primary();

        t.string('name').notNullable();

        t.integer('email_type_id').unsigned().notNullable();
        t.foreign('email_type_id').references('email_type.id');

        t.unique(['name', 'email_type_id']);

        t.timestamps(false, true);
    });
};


exports.down = function(knex, Promise) {
    return knex.schema.dropTable('email');
};

