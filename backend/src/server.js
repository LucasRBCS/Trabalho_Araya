require('dotenv').config({ path: '../.env' }); // Carrega as variáveis de ambiente antes de qualquer coisa
const app = require('./app'); // Importa a aplicação Express que configuramos

const PORT = process.env.PORT || 3000; // Pega a porta do .env ou usa 3000 como padrão

app.listen(PORT, () => {
  console.log(`Servidor backend rodando na porta ${PORT}`); // Mensagem de sucesso ao iniciar
});