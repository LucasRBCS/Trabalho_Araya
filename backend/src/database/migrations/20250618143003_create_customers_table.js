/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('customers', (table) => {
    table.increments('id').primary(); // ID auto-incrementável e chave primária
    table.string('name').notNullable(); // Nome do cliente, não pode ser nulo
    table.string('email').unique().notNullable(); // Email único e não nulo
    table.string('phone'); // Telefone (opcional)
    table.timestamps(true, true); // created_at e updated_at (gerados automaticamente)
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable('customers'); // Comando para desfazer a migração (excluir a tabela)
};
