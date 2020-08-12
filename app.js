const express = require('express');
const app = express();

//Rotas
const rotasProdutos = require('./routes/produtos');
const rotasPedidos = require('./routes/pedidos');

app.use('/produtos', rotasProdutos);
app.use('/pedidos', rotasPedidos);

module.exports = app;
