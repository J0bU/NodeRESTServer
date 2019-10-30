// =======================================
// DECLARACIÓN DE CADA UNA DE LAS RUTAS QUE TOMARÁ SERVER.JS (Usuario, login, etcétera).
// ========================================

const express = require('express');
const app = express();

app.use(require('./usuario'));
app.use(require('./login'));
app.use(require('./categorias'));
app.use(require('./productos'));

module.exports = app;