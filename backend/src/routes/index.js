const express = require('express');
const router = express.Router(); // Cria um novo roteador Express

// Importa os controllers
const customerController = require('../controllers/customerController');
const productController = require('../controllers/productController');
const salesController = require('../controllers/salesController');

// --- Rotas de Clientes ---
router.get('/customers', customerController.getAllCustomers); // GET para listar todos
router.get('/customers/:id', customerController.getCustomerById); // GET para buscar por ID
router.post('/customers', customerController.createCustomer); // POST para criar novo
router.put('/customers/:id', customerController.updateCustomer); // PUT para atualizar por ID
router.delete('/customers/:id', customerController.deleteCustomer); // DELETE para excluir por ID

// --- Rotas de Produtos ---
router.get('/products', productController.getAllProducts);
router.get('/products/:id', productController.getProductById);
router.post('/products', productController.createProduct);
router.put('/products/:id', productController.updateProduct);
router.delete('/products/:id', productController.deleteProduct);

// --- Rotas de Vendas ---
router.get('/sales', salesController.getAllSales);
router.get('/sales/:id', salesController.getSaleById);
router.post('/sales', salesController.createSale);
// Não teremos uma rota PUT para vendas, pois geralmente vendas não são "atualizadas"
// (seria mais complexo, envolvendo estorno, etc. - para este projeto, delete e recrie se necessário)
router.delete('/sales/:id', salesController.deleteSale);

module.exports = router; // Exporta o roteador para ser usado pela aplicação principal