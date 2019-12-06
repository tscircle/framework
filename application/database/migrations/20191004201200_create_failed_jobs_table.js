exports.up = function(knex, Promise) {
    return knex.schema.createTable('failed_jobs', function (t) {
        t.increments('id').unsigned().primary();
        t.timestamps(false, true);
        t.string('name').nullable();
        t.text('payload').nullable();
        t.text('error').nullable();
    });
};


exports.down = function(knex, Promise) {
    return knex.schema.dropTable('failed_jobs');
};
