/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('sales', (table) => {
    table.increments('id').primary();
    table.integer('customer_id').unsigned().notNullable(); // ID do cliente (unsigned para chaves estrangeiras)
    table.integer('product_id').unsigned().notNullable(); // ID do produto
    table.integer('quantity').notNullable(); // Quantidade vendida
    table.decimal('total_amount', 10, 2).notNullable(); // Valor total da venda
    table.string('payment_method').notNullable(); // Método de pagamento (ex: 'credit_card', 'cash')
    table.timestamps(true, true);

    // Chaves estrangeiras para vincular vendas a clientes e produtos
    table
      .foreign('customer_id')
      .references('id')
      .inTable('customers')
      .onDelete('CASCADE'); // Se o cliente for excluído, suas vendas também são
    table
      .foreign('product_id')
      .references('id')
      .inTable('products')
      .onDelete('CASCADE'); // Se o produto for excluído, vendas relacionadas também
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable('sales');
};
