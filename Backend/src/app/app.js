const express = require('express');
const app = express();
const cors = require('cors');
const catalogosController = require('./controladores/CatalogosController');
const authController = require('./controladores/AuthController');
const usuariosController = require('./controladores/UsuariosController');
const quejasController = require('./controladores/QuejasController');
const empleadosController = require('./controladores/EmpleadosController');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: false}));

app.use('/api/catalogos/', catalogosController);
app.use('/api/usuarios/', usuariosController);
app.use('/api/', authController);
app.use('/api/quejas/', quejasController);
app.use('/api/empleados/', empleadosController);

module.exports = app;