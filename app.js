const express = require('express');
const app = express();

//Req = Requisição
//Res = Resposta
//Next = Chama outro metodo
app.use((req, res, next) => {
    res.status(200).send({
        mensagem: 'Ok, deu certo'
    });
});

module.exports = app;
