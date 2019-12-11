exports.up = function(knex, Promise) {
    return knex.schema.createTable('state_machine', function (t) {
        t.increments('id').unsigned().primary();

        t.text('currentState').notNullable();

        t.timestamps(false, true);
    });
};


exports.down = function(knex, Promise) {
    return knex.schema.dropTable('state_machine');
};

