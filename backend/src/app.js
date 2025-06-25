const express = require('express');
const cors = require('cors'); // Importa o módulo CORS
const routes = require('./routes'); // Importa as rotas que acabamos de definir

const app = express(); // Inicializa a aplicação Express

app.use(cors()); // Habilita o CORS para permitir requisições do frontend
app.use(express.json()); // Middleware para que o Express entenda requisições com corpo JSON

app.use('/api', routes); // Prefixa todas as rotas definidas em 'routes' com '/api'

module.exports = app; // Exporta a aplicação para ser usada pelo arquivo do servidor