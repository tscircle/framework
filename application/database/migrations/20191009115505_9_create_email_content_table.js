exports.up = function(knex, Promise) {
    return knex.schema.createTable('email_content', function (t) {
        t.increments('id').unsigned().primary();

        t.text('mjml').nullable();

        t.text('html').nullable();

        t.text('comment').nullable();

        t.integer('email_id').unsigned().notNullable();
        t.foreign('email_id').references('email.id');

        t.integer('layout_email_id').unsigned().nullable();
        t.foreign('layout_email_id').references('email.id');

        t.boolean('active').defaultTo(false);

        t.unique(['active', 'email_id']);

        t.timestamps(false, true);
    });
};


exports.down = function(knex, Promise) {
    return knex.schema.dropTable('email_content');
};

