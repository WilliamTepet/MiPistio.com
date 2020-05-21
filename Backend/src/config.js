const pgp = require("pg-promise")();
const { Pool } = require('pg');
const cn = 'postgres://postgres:123456@35.225.155.141:5432/postgres';
const db = pgp(cn);

const configDB = {
    user: 'postgres',
    host: '35.225.155.141',
    password: '123456',
    database: 'postgres'
}

const pool = new Pool(configDB);

const config = {
    port: 3000,
    secretKey: '6LdC8PgUAAAAAFzCG60Py5Mhs7VoK_W-1JLfIElc'
}

module.exports = { config, db, pool }