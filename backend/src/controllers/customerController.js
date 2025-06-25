const knexConfig = require('../config/knexfile'); // Importa a configuração
const knex = require('knex')(knexConfig.development); // Inicializa o Knex com a configuração

exports.getAllCustomers = async (req, res) => {
  try {
    const customers = await knex('customers').select('*'); // Seleciona todos os clientes
    res.json(customers);
  } catch (error) {
    console.error('Erro no getAllCustomers:', error);
    res.status(500).json({ error: error.message }); // Em caso de erro, retorna status 500
  }
};

exports.getCustomerById = async (req, res) => {
  try {
    const { id } = req.params; // Pega o ID dos parâmetros da URL
    const customer = await knex('customers').where({ id }).first(); // Busca um cliente pelo ID
    if (!customer) {
      return res.status(404).json({ message: 'Cliente não encontrado.' }); // Se não encontrar, retorna 404
    }
    res.json(customer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createCustomer = async (req, res) => {
  try {
    const { name, email, phone } = req.body; // Pega os dados do corpo da requisição
    const [id] = await knex('customers').insert({ name, email, phone }); // Insere o novo cliente e retorna o ID
    const newCustomer = await knex('customers').where({ id }).first(); // Busca o cliente recém-criado
    res.status(201).json(newCustomer); // Retorna o cliente criado com status 201 (Created)
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateCustomer = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, phone } = req.body;
    const updatedRows = await knex('customers').where({ id }).update({ name, email, phone }); // Atualiza o cliente
    if (updatedRows === 0) {
      return res.status(404).json({ message: 'Cliente não encontrado.' });
    }
    const updatedCustomer = await knex('customers').where({ id }).first(); // Busca o cliente atualizado
    res.json(updatedCustomer); // Retorna o cliente atualizado
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteCustomer = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedRows = await knex('customers').where({ id }).del(); // Deleta o cliente
    if (deletedRows === 0) {
      return res.status(404).json({ message: 'Cliente não encontrado.' });
    }
    res.status(204).send(); // Retorna status 204 (No Content) para indicar sucesso sem retorno de corpo
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};