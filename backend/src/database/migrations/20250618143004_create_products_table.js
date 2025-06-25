/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('products', (table) => {
    table.increments('id').primary();
    table.string('name').notNullable();
    table.text('description'); // Descrição mais longa
    table.decimal('price', 10, 2).notNullable(); // Preço (10 dígitos no total, 2 após a vírgula)
    table.integer('stock').notNullable().defaultTo(0); // Quantidade em estoque, padrão 0
    table.timestamps(true, true);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
   return knex.schema.dropTable('products');
};
