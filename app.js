const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');

//Rotas
const rotasProdutos = require('./routes/produtos');
const rotasPedidos = require('./routes/pedidos');
const rotaUsuarios = require('./routes/usuarios');

app.use(morgan('dev')); //Executa e da um callback para dar procedimentos nos demais itens abaixo, monitora a execução e mostra no log

//Para deixar a pasta de Uploads acessivel
app.use('/uploads', express.static('uploads'));

app.use(bodyParser.urlencoded({ extended: false })) // Aceita apenas dados simples
app.use(bodyParser.json()); //Só vai aceitar dados JSON no body

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header(
        'Access-Control-Allow-Header',
        'Origin, X-Requested-With, Content-Type, Accept, Authorization',
    );

    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).send({});
    }

    next();
});

app.use('/produtos', rotasProdutos);
app.use('/pedidos', rotasPedidos);
app.use('/usuarios', rotaUsuarios)

// QUANDO NÃO ENCONTRA ROTA 
app.use((req, res, next) => {
    const erro = new Error('Não encontrado');
    erro.status = 404;
    next(erro);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    return res.send({
        erro: {
            mensagem: error.message
        }
    });
});

module.exports = app;
