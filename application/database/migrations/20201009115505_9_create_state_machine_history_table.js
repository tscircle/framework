exports.up = function(knex, Promise) {
    return knex.schema.createTable('state_machine_history', function (t) {
        t.increments('id').unsigned().primary();

        t.integer('state_machine_id').unsigned().nullable();
        t.foreign('state_machine_id').references('state_machine.id');

        t.string('state').notNullable();
        t.text('state_object').notNullable();

        t.timestamps(false, true);
    });
};


exports.down = function(knex, Promise) {
    return knex.schema.dropTable('state_machine_history');
};

