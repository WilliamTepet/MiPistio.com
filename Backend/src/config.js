const pgp = require("pg-promise")();
const { Pool } = require('pg');
const cn = 'postgres://postgres:123456@35.222.162.190:5432/postgres';
const db = pgp(cn);

const configDB = {
    user: 'postgres',
    host: '35.222.162.190',
    password: '123456',
    database: 'postgres'
}

const pool = new Pool(configDB);

const config = {
    port: 3000,
}

module.exports = { config, db, pool }