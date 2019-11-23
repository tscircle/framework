import * as Knex from "knex";


export async function up(knex: Knex): Promise<any> {
    return knex.schema.createTable('email_type', function (t) {
        t.increments('id').unsigned().primary();

        t.string('name').notNullable();

        t.boolean('extendable').defaultTo(false);

        t.timestamps(false, true);
    });
}


export async function down(knex: Knex): Promise<any> {
    return knex.schema.dropTable('email_type');
}

