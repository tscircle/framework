import * as Knex from "knex";


export async function up(knex: Knex): Promise<any> {
    return knex.schema.createTable('email', function (t) {
        t.increments('id').unsigned().primary();

        t.string('name').notNullable();

        t.integer('email_type_id').unsigned().notNullable();
        t.foreign('email_type_id').references('email_type.id');

        t.unique(['name', 'email_type_id']);

        t.timestamps(false, true);
    });
}


export async function down(knex: Knex): Promise<any> {
    return knex.schema.dropTable('email');
}

