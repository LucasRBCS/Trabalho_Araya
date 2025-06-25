const knexConfig = require('../config/knexfile');
const knex = require('knex')(knexConfig.development);

exports.getAllSales = async (req, res) => {
  try {
    // Seleciona as vendas, unindo com as tabelas de clientes e produtos para obter os nomes
    const sales = await knex('sales')
      .select(
        'sales.id',
        'customers.name as customer_name', // Nome do cliente
        'products.name as product_name',   // Nome do produto
        'sales.quantity',
        'sales.total_amount',
        'sales.payment_method',
        'sales.created_at'
      )
      .join('customers', 'sales.customer_id', '=', 'customers.id')
      .join('products', 'sales.product_id', '=', 'products.id');
    res.json(sales);
  } catch (error) {
    console.error('Erro no getAllSales:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.getSaleById = async (req, res) => {
  try {
    const { id } = req.params;
    const sale = await knex('sales')
      .select(
        'sales.id',
        'customers.name as customer_name',
        'products.name as product_name',
        'sales.quantity',
        'sales.total_amount',
        'sales.payment_method',
        'sales.created_at'
      )
      .join('customers', 'sales.customer_id', '=', 'customers.id')
      .join('products', 'sales.product_id', '=', 'products.id')
      .where('sales.id', id)
      .first();
    if (!sale) {
      return res.status(404).json({ message: 'Venda não encontrada.' });
    }
    res.json(sale);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createSale = async (req, res) => {
  try {
    const { customer_id, product_id, quantity, payment_method } = req.body;

    // ----- Lógica de validação e estoque antes de registrar a venda -----
    const customer = await knex('customers').where({ id: customer_id }).first();
    const product = await knex('products').where({ id: product_id }).first();

    if (!customer) {
      return res.status(404).json({ message: 'Cliente não encontrado.' });
    }
    if (!product) {
      return res.status(404).json({ message: 'Produto não encontrado.' });
    }
    if (product.stock < quantity) {
      return res.status(400).json({ message: `Estoque insuficiente para ${product.name}. Disponível: ${product.stock}` });
    }
    // --------------------------------------------------------------------

    const total_amount = product.price * quantity;

    // Usa uma transação para garantir que a venda seja registrada E o estoque atualizado
    await knex.transaction(async (trx) => {
      // 1. Insere a venda
      const [id] = await trx('sales').insert({
        customer_id,
        product_id,
        quantity,
        total_amount,
        payment_method,
      });

      // 2. Atualiza o estoque do produto (decrementa a quantidade vendida)
      await trx('products')
        .where({ id: product_id })
        .decrement('stock', quantity);

      const newSale = await trx('sales').where({ id }).first();
      res.status(201).json(newSale); // Retorna a venda recém-criada
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteSale = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedRows = await knex('sales').where({ id }).del();
    if (deletedRows === 0) {
      return res.status(404).json({ message: 'Venda não encontrada.' });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};