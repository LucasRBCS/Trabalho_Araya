const knexConfig = require('../config/knexfile');
const knex = require('knex')(knexConfig.development);

exports.getAllProducts = async (req, res) => {
  try {
    const products = await knex('products').select('*');
    res.json(products);
  } catch (error) {
    console.error('Erro no getAllProducts:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await knex('products').where({ id }).first();
    if (!product) {
      return res.status(404).json({ message: 'Produto não encontrado.' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createProduct = async (req, res) => {
  try {
    const { name, description, price, stock } = req.body;
    const [id] = await knex('products').insert({ name, description, price, stock });
    const newProduct = await knex('products').where({ id }).first();
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, stock } = req.body;
    const updatedRows = await knex('products').where({ id }).update({ name, description, price, stock });
    if (updatedRows === 0) {
      return res.status(404).json({ message: 'Produto não encontrado.' });
    }
    const updatedProduct = await knex('products').where({ id }).first();
    res.json(updatedProduct);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedRows = await knex('products').where({ id }).del();
    if (deletedRows === 0) {
      return res.status(404).json({ message: 'Produto não encontrado.' });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};