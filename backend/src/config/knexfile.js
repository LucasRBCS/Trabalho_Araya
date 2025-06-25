// Carrega as variáveis de ambiente do arquivo .env
require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });

module.exports = {
  development: {
    client: process.env.DB_CLIENT,
    connection: {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
    },
    // Onde o Knex deve procurar pelos arquivos de migração
    migrations: {
      directory: '../database/migrations',
    },
    // Define o valor padrão para colunas que não recebem um valor
    useNullAsDefault: true,
  },
};