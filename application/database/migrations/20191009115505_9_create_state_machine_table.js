exports.up = function(knex, Promise) {
    return knex.schema.createTable('state_machine', function (t) {
        t.increments('id').unsigned().primary();

        t.text('filename').notNullable();
        t.string('state').notNullable();
        t.text('state_object').notNullable();

        t.timestamps(false, true);
    });
};


exports.down = function(knex, Promise) {
    return knex.schema.dropTable('state_machine');
};

