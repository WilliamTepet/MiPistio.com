const express = require('express');
const app = express();
const cors = require('cors');
const catalogosController = require('./controladores/CatalogosController');
const authController = require('./controladores/AuthController');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: false}));

app.use('/api/catalogos/', catalogosController);
app.use('/api/', authController);

module.exports = app;