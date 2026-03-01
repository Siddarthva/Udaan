const knex = require('knex');
const dotenv = require('dotenv');

dotenv.config();

const connectionObject = {
    client: 'pg',
    connection: {
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT || 5432,
        user: process.env.DB_USER || 'postgres',
        password: process.env.DB_PASSWORD || 'postgres',
        database: process.env.DB_NAME || 'udaan'
    },
    pool: {
        min: 2,
        max: 10
    },
    migrations: {
        tableName: 'knex_migrations',
        directory: '../migrations'
    }
};

const db = knex(connectionObject);

// Database Connection check 🐘
db.raw('select 1')
    .then(() => console.log('✅ [DATABASE CONNECTED]: PostgreSQL Active'))
    .catch((err) => {
        console.error('❌ [DATABASE ERROR]: Failed to connect to PostgreSQL');
        console.error(err.message);
    });

module.exports = db;
